import {SLTMatchingRules} from "./SLTMatchingRules";
import {SLTCells} from "./SLTCells";
import {Dictionary} from "../../Dictionary";
import {SLTChunkAssetDatum} from "./SLTChunkAssetDatum";

export class SLTMatchingBoardConfig {
    private readonly _matchingRules: SLTMatchingRules;
    private readonly _blockedCells: any[];
    private readonly _cellProperties: any[];
    private readonly _cols: number;
    private readonly _rows: number;
    private readonly _cells: SLTCells;
    private readonly _assetMap: Dictionary<any>;
    private readonly _layers: Dictionary<any>;

    constructor(cells: SLTCells, layers: Dictionary<any>, boardNode: any, assetMap: Dictionary<any>, matchingRules: SLTMatchingRules) {
        this._assetMap = assetMap;
        this._matchingRules = matchingRules;
        this._blockedCells = boardNode.hasOwnProperty("blockedCells") ? boardNode.blockedCells : [];
        this._cellProperties = boardNode.hasOwnProperty("cellProperties") ? boardNode.cellProperties : [];

        this._cols = boardNode.cols;
        this._rows = boardNode.rows;

        this._cells = cells;
        this._layers = layers;
    }

    get matchingRules(): SLTMatchingRules {
        return this._matchingRules;
    }

    get blockedCells(): any[] {
        return this._blockedCells;
    }

    get cellProperties(): any[] {
        return this._cellProperties;
    }

    get cols(): number {
        return this._cols;
    }

    get rows(): number {
        return this._rows;
    }

    get cells(): SLTCells {
        return this._cells;
    }

    get assetMap(): Dictionary<any> {
        return this._assetMap;
    }

    get layers(): Dictionary<any> {
        return this._layers;
    }

    get matchSize(): number {
        return this._matchingRules.matchSize;
    }

    get matchingRulesEnabled(): boolean {
        return this._matchingRules.matchingRuleEnabled;
    }

    get squareMatchingRuleEnabled(): Boolean {
        return this._matchingRules.squareMatchEnabled;
    }

    get excludedMatchAssets(): SLTChunkAssetDatum[] {
        return this._matchingRules.excludedAssets;
    }
}