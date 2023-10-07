import { BoardScene } from "./boardScene";
import { CommandReturnValue, Engine } from "./engine";
import { Renderer } from "./renderer";
import { BoardSocket } from "./socket";

export class BoardApp extends Engine {
    private _socket: BoardSocket;
    private _scene: BoardScene;

    public boardName: string;
    public userName: string;

    constructor(canvasId: string, brokerUrl: string) {
        super(canvasId, new Renderer(canvasId));

        this._socket = new BoardSocket(brokerUrl, this.wsMessage);
        this._socket.connect();

        this.boardName = 'default';
        this._scene = new BoardScene(this);
    }

    public get socket(): BoardSocket {
        return this._socket;
    }

    public setup(boardName: string, username: string): void {
        this.boardName = boardName;
        this.userName = username;
    }

    public update(dt: number): void {
        this._scene.update(dt);
        // console.log(1.0 / dt); // fps
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);
        this._scene.draw(ctx);
    }

    public command(cmd: string, ...args: any): CommandReturnValue {
        console.log(`Executing cmd: ${cmd}, args: ${args}`);
        return this._scene.command(cmd, args);
    }

    // define this as property
    wsMessage = (message: any): void  => {
        this._scene.wsMessage(message);
    }
}
