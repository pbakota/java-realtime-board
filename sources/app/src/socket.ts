import { v4 as uuidv4 } from 'uuid';
import { IFrame, RxStomp, RxStompRPC } from '@stomp/rx-stomp';
import { ActionMessage } from './models';

interface FnMethodCallCallback {
    (response: any): void;
}

export interface FnWsMessageCallback {
    (response: ActionMessage): void;
}

export class BoardSocket {
    private _rxStomp: RxStomp;
    private _rxStompRPC: RxStompRPC;
    private _wsCallback: FnWsMessageCallback;

    constructor(brokerUrl: string, wscallback: FnWsMessageCallback) {
        this._wsCallback = wscallback;
        this._rxStomp = new RxStomp();
        this._rxStomp.configure({
            brokerURL: brokerUrl,
            reconnectDelay: 1000,
        });
        const queueName = uuidv4();
        this._rxStompRPC = new RxStompRPC(this._rxStomp, {
            replyQueueName: `/queue/replies-${queueName}`,
            setupReplyQueue: (replyQueueName, rxStomp) => {
                return rxStomp.watch(replyQueueName, {
                    // NOTE: These header values need to match with the values that were used in websocket server queue to prevent
                    // exception ( payload=RESOURCE_LOCKED - cannot obtain exclusive access to locked queue 'replies-eda3b8...(truncated))
                    "auto-delete": "true",
                    "durable": "false",
                    "exclusive": "false"
                });
            }
        });
    }

    public connect(): void {
        this._rxStomp.activate();
        this._rxStomp
            .watch({ destination: "/topic/outgoing" })
            .subscribe((message) => {
                console.log(message.body)
                this._wsCallback(JSON.parse(message.body) as ActionMessage);
            });
        this._rxStomp.stompClient.onDisconnect = () => {
            console.log("Socket disconnected");
        }
    }

    public sendMessage(message: ActionMessage): void {
        this._rxStomp.publish({
            destination: "/app/incoming",
            body: JSON.stringify({'message': JSON.stringify(message) })
        });
    }

    public callMethod<T>(callback: FnMethodCallCallback, methodName: string, ...args: any): void {
        this._rxStompRPC.rpc({
            destination: '/app/api/request',
            body: JSON.stringify({ method: methodName, args: args })
        }).subscribe((response: IFrame) => {
            callback(JSON.parse(response.body) as T);
        });
    }
}