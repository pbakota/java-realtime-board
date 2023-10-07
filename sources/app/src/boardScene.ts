import { v4 as uuidv4 } from 'uuid';
import { Box, Circle, Shape, Triangle } from "./items";
import { Scene } from "./scene";
import { Input } from './engine';
import { Vector2d } from './util';
import { BoardApp } from './app';
import { ActionMessage, ApiResponse, BoardItemEntity, ObjectCreateMessage, ObjectMovedMessage, ObjectRemovedMessage, UserMessage } from './models';

export class BoardScene implements Scene {

    private _app: BoardApp;
    private _input: Input;
    private _shapes: Shape[];
    private _selected: Shape | null;
    private _canvasWidth: number;
    private _canvasHeight: number;
    private _newPosition: Vector2d;
    private _offset: Vector2d;
    private _removeSelected: boolean;

    constructor(app: BoardApp) {

        this._app = app;
        this._input = app.input;
        this._shapes = [];

        this._canvasWidth = this._app.renderer.display.width;
        this._canvasHeight = this._app.renderer.display.height;

        this._newPosition = new Vector2d(this._canvasWidth / 2, this._canvasHeight / 2);

        this._selected = null;
        this._removeSelected = false;
    }

    public update(dt: number): void {
        const mouse = this._input.mousePos();
        if (this._input.isMouseDown()) {
            if (this._selected == null) {
                this._shapes.forEach(s => {
                    if (s.isOver(mouse.x, mouse.y)) {
                        if (this._selected?.id != s.id) {
                            this._offset = new Vector2d(s.position.x - mouse.x, s.position.y - mouse.y);
                            this._selected = s;
                            console.log('Selected ' + s.id);
                            return;
                        }
                    }
                });
                if (this._selected != null && this._removeSelected) {
                    this._app.socket.sendMessage(new ObjectRemovedMessage((this._selected as Shape).id, this._app.boardName));
                    this._selected = null;
                }
                this._removeSelected = false;
            }

            if (this._selected != null) {
                this._selected.position = mouse.add(this._offset);
                this._app.socket.sendMessage(new ObjectMovedMessage(this._selected.id, this._app.boardName, this._selected.position));
            }
        } else {
            this._selected = null;
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this._shapes.forEach(s => {
            s.draw(ctx);
        });
    }

    public command(cmd: string, args: any) {

        if (/^add\-/.test(cmd)) {
            let shapeType: string | null = null;
            let position: Vector2d = new Vector2d(this._newPosition.x, this._newPosition.y);
            let size: Vector2d = new Vector2d(100, 100);
            // add commands
            switch (cmd) {
                case 'add-circle':
                    shapeType = 'circle';
                    break;
                case 'add-rect':
                    shapeType = 'rect';
                    break;
                case 'add-triangle':
                    shapeType = 'triangle';
                    break;
                default:
                    throw "Invalid add command";
            }

            const faceColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            const borderColor = 'black';
            const strokeWidth = 3;

            this._app.socket.sendMessage(new ObjectCreateMessage(uuidv4(), this._app.boardName, shapeType as string, position, size,
                faceColor, borderColor, strokeWidth));

        } else {
            switch (cmd) {
                case 'refresh-board':
                    this.refreshBoard();
                    break;
                case 'remove-selected':
                    this._removeSelected = true;
                    break;
                case 'send-message':
                    this._app.socket.sendMessage(new UserMessage(this._app.boardName, args[0], args[1]));
                    break;
                default:
                    throw "Invalid command";
            }
        }
    }

    private addShape(bi: BoardItemEntity) {
        let newShape: Shape | null = null;
        switch (bi.type) {
            case 'CIRCLE':
                newShape = new Circle(bi.id, bi.position.x, bi.position.y, bi.size.x, bi.size.y, bi.faceColor, bi.borderColor);
                break;
            case 'RECT':
                newShape = new Box(bi.id, bi.position.x, bi.position.y, bi.size.x, bi.size.y, bi.faceColor, bi.borderColor);
                break;
            case 'TRIANGLE':
                newShape = new Triangle(bi.id, bi.position.x, bi.position.y, bi.size.x, bi.size.y, bi.faceColor, bi.borderColor);
                break;
            default:
                throw "Invalid shape";
        }
        this._shapes.push(newShape);

    }
    public refreshBoard(): void {
        this._shapes = [];
        this._app.socket.callMethod<ApiResponse<BoardItemEntity[]>>((response: ApiResponse<BoardItemEntity[]>) => {
            response.body.forEach(itemEntity => {
                this.addShape(itemEntity);
            });
        }, 'get-board-items', this._app.boardName);
    }

    public wsMessage(message: ActionMessage): void {
        switch (message.type) {
            case 'OBJECT_CREATED': {
                const obj = message as ObjectCreateMessage;
                let newShape: Shape | null = null;
                switch (obj.itemType.toUpperCase()) {
                    case 'CIRCLE':
                        newShape = new Circle(obj.id, obj.position.x, obj.position.y, obj.size.x, obj.size.y, obj.faceColor, obj.borderColor);
                        break;
                    case 'RECT':
                        newShape = new Box(obj.id, obj.position.x, obj.position.y, obj.size.x, obj.size.y, obj.faceColor, obj.borderColor);
                        break;
                    case 'TRIANGLE':
                        newShape = new Triangle(obj.id, obj.position.x, obj.position.y, obj.size.x, obj.size.y, obj.faceColor, obj.borderColor);
                        break;
                    default:
                        throw "Invalid shape";
                }
                this._shapes.push(newShape);
            } break;
            case 'OBJECT_REMOVED': {
                const obj = message as ObjectRemovedMessage;
                this._shapes = this._shapes.filter(s => s.id != obj.id);
            } break;
            case 'OBJECT_MOVED': {
                const obj = message as ObjectMovedMessage;
                let shape = this._shapes.find(value => value.id == obj.id);
                if (shape) {
                    shape.position = obj.position;
                }
            } break;
            case 'USER_MESSAGE': {
                const obj = message as UserMessage;
                const messageOutput = (document.getElementById('message-output') as HTMLElement).getElementsByTagName('tbody')[0];
                const newRow = messageOutput.insertRow();
                const newCol = newRow.insertCell();
                newRow.style.cssText = 'th-lg';
                newCol.innerHTML = `<em>${obj.user} say</em>: ${obj.message}`;
                messageOutput.appendChild(newRow);

                // To scroll to the bottom
                messageOutput.scrollTop = messageOutput.scrollHeight;
            } break;
            default:
                console.error(message);
                throw "Invalid message type";
        }
    }
}