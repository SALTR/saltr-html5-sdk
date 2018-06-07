import {SLTAssetPlaceHolder} from "../SLTAssetPlaceHolder";

export class SLTCanvasPlaceHolder extends SLTAssetPlaceHolder {

    private readonly _x:number;
    private readonly _y:number;


    constructor(x: number, y: number, tags: any[]) {
        super(tags);
        this._x = x;
        this._y = y;
    }


    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }
}