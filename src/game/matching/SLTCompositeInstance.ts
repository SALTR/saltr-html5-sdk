import {SLTAssetInstance} from "../SLTAssetInstance";
import {SLTAssetState} from "../SLTAssetState";

export class SLTCompositeInstance extends SLTAssetInstance {
    private readonly _cells: any[];

    constructor(token:string, state:SLTAssetState, properties:any, cells: any[]) {
        super(token, state, properties);
        this._cells = cells;
    }

    get cells(): any[] {
        return this._cells;
    }
}