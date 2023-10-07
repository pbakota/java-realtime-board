

export class Renderer {

    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    private _bcanvas: HTMLCanvasElement;
    private _bctx: CanvasRenderingContext2D;

    constructor(canvasId: string) {
        this._canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this._ctx = this._canvas.getContext("2d") as CanvasRenderingContext2D;
        this._bcanvas = this._canvas.cloneNode(true) as HTMLCanvasElement;
        this._bctx = this._bcanvas.getContext("2d") as CanvasRenderingContext2D;
    }

    public get display(): HTMLCanvasElement {
        return this._canvas;
    }

    public get context(): CanvasRenderingContext2D {
        return this._ctx;
    }

    public get backbuffer(): HTMLCanvasElement {
        return this._bcanvas;
    }

    public get bctx(): CanvasRenderingContext2D {
        return this._bctx;
    }

    public flip(): void {
        this._ctx.drawImage(this._bcanvas, 0, 0);
    }
}