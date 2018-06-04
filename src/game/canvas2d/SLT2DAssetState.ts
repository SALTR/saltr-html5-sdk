import {SLTAssetState} from "../SLTAssetState";

export class SLT2DAssetState extends SLTAssetState {
    private readonly _pivotX:number;
    private readonly _pivotY:number;
    private _width:number;
    private _height:number;


    constructor(token: string, pivotX: number, pivotY: number, width: number, height: number) {
        super(token);
        this._pivotX = pivotX;
        this._pivotY = pivotY;
        this._width = width;
        this._height = height;
    }

    get pivotX(): number {
        return this._pivotX;
    }

    get pivotY(): number {
        return this._pivotY;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    clone():SLT2DAssetState {
        return new SLT2DAssetState(this.token, this.pivotX, this.pivotY, this.width, this.height);
    }
}