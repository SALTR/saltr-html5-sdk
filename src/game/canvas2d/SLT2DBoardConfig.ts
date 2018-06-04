import {Dictionary} from "../../Dictionary";

export class SLT2DBoardConfig {
    private readonly _layers:Dictionary<any>;
    private readonly _height:number;
    private readonly _width:number;
    private readonly _assetMap:Dictionary<any>;


    constructor(layers: Dictionary<any>, boardNode:any,  assetMap: Dictionary<any>) {
        this._layers = layers;
        this._height = boardNode.hasOwnProperty("height") ? boardNode.width : 0;
        this._width = boardNode.hasOwnProperty("width") ? boardNode.width : 0;
        this._assetMap = assetMap;
    }

    get layers(): Dictionary<any> {
        return this._layers;
    }

    get height(): number {
        return this._height;
    }

    get width(): number {
        return this._width;
    }

    get assetMap(): Dictionary<any> {
        return this._assetMap;
    }
}