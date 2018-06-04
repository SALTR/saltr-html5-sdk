import {SLTBoardLayer} from "../SLTBoardLayer";

export class SLT2DBoardLayer extends SLTBoardLayer {
    private readonly _assetRules: any[];

    constructor(token:string, layerIndex:number, assetRules: any[]) {
        super(token, layerIndex);
        this._assetRules = assetRules;
    }

    get assetRules(): any[] {
        return this._assetRules;
    }
}