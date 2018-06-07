import {Dictionary} from "../../Dictionary";
import {SLT2DBoardConfig} from "./SLT2DBoardConfig";
import {SLT2DAssetInstance} from "./SLT2DAssetInstance";
import {SLT2DBoardLayer} from "./SLT2DBoardLayer";
import {SLT2DBoardGenerator} from "./SLT2DBoardGenerator";
import {SLTBoard} from "../SLTBoard";

export class SLT2DBoard extends SLTBoard {
    private _assetInstancesByLayerId:Dictionary<any>;
    private _assetInstancesByLayerIndex:Dictionary<any>;
    private _config:SLT2DBoardConfig;

    /**
     * Class constructor.
     * @param token
     * @param config The board configuration.
     * @param propertyObjects The board associated properties.
     * @param checkpoints The board checkpoints.
     */
    constructor(token:string, config:SLT2DBoardConfig, propertyObjects:Dictionary<any>, checkpoints:Dictionary<any>) {
        super(token, config.layers, propertyObjects, checkpoints);
        this._config = config;
    }

    getAssetInstancesByLayerId(layerId:string):SLT2DAssetInstance[] {
        return this._assetInstancesByLayerId[layerId];
    }

    getAssetInstancesByLayerIndex(index:number):SLT2DAssetInstance[] {
        return this._assetInstancesByLayerIndex[index];
    }

    /**
     * The width of the board in pixels as is in Saltr level editor.
     */
    get width():number {
        return this._config.width;
    }

    /**
     * The height of the board in pixels as is in Saltr level editor.
     */
    get height():number {
        return this._config.height;
    }

   regenerate():void {
       this._assetInstancesByLayerId = {};
       this._assetInstancesByLayerIndex = {};

        for (var layerToken in this._config.layers) {
            var layer:SLT2DBoardLayer = this._config.layers[layerToken] as SLT2DBoardLayer;
            var generator:SLT2DBoardGenerator = new SLT2DBoardGenerator();
            generator.generate(this._config, layer, this._assetInstancesByLayerId, this._assetInstancesByLayerIndex);
        }
    }
}