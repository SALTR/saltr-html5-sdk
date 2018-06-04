import {SLTChunkAssetDatum} from "./SLTChunkAssetDatum";

export class SLTMatchingRules {
    public static MATCHING_RULES:string = "matchingRules";

    private _matchingRuleEnabled:boolean;
    private _matchSize:number;
    private _squareMatchEnabled:boolean;
    private _excludedAssets:SLTChunkAssetDatum[];


    constructor() {
        this._matchingRuleEnabled = false;
        this._matchSize = 0;
        this._squareMatchEnabled = false;
        this._excludedAssets = null;
    }


    get matchingRuleEnabled(): boolean {
        return this._matchingRuleEnabled;
    }

    set matchingRuleEnabled(value: boolean) {
        this._matchingRuleEnabled = value;
    }

    get matchSize(): number {
        return this._matchSize;
    }

    set matchSize(value: number) {
        this._matchSize = value;
    }

    get squareMatchEnabled(): boolean {
        return this._squareMatchEnabled;
    }

    set squareMatchEnabled(value: boolean) {
        this._squareMatchEnabled = value;
    }

    get excludedAssets(): SLTChunkAssetDatum[] {
        return this._excludedAssets;
    }

    set excludedAssets(value: SLTChunkAssetDatum[]) {
        this._excludedAssets = value;
    }
}