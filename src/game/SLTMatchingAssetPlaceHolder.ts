import {SLTAssetPlaceHolder} from "./SLTAssetPlaceHolder";

export class SLTMatchingAssetPlaceHolder extends SLTAssetPlaceHolder {
    private readonly _col: number;
    private readonly _row: number;

    constructor(col: number, row: number, tags:any[]) {
        super(tags);
        this._col = col;
        this._row = row;
    }

    get col(): number {
        return this._col;
    }

    get row(): number {
        return this._row;
    }
}