import {Point} from "../canvas2d/Point";
import {SLTAssetState} from "../SLTAssetState";
import {SLTAssetInstance} from "../SLTAssetInstance";

export class SLTMultiCellAssetInstance extends SLTAssetInstance {
    private readonly _cells: any[];
    private readonly _startPoint:Point;

    constructor(token:string, state:SLTAssetState, properties:any, cells:any[], startPoint:Point, positions:any[] = null) {
        super(token, state, properties, positions);
        this._cells = cells;
        this._startPoint = startPoint;
    }

    get cells(): any[] {
        return this._cells;
    }

    get startPoint(): Point {
        return this._startPoint;
    }
}