import {SLTAsset} from "../SLTAsset";
import {Point} from "../canvas2d/Point";
import {Dictionary} from "../../Dictionary";

export class SLTMultiCellAsset extends SLTAsset {
    private readonly _cells:any[];
    private readonly _startPoint:Point;

    constructor(token:string, cells:any[], startPoint:any[],  stateNodesMap:Dictionary<any>, properties:any) {
        super(token, stateNodesMap, properties);
        this._cells = cells;
        this._startPoint = new Point(startPoint[0], startPoint[1]);
    }

    get cells(): any[] {
        return this._cells;
    }

    get startPoint(): Point {
        return this._startPoint;
    }
}