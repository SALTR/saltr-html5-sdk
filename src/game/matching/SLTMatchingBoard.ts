import {SLTMatchingBoardConfig} from "./SLTMatchingBoardConfig";
import {SLTBoard} from "../SLTBoard";
import {Dictionary} from "../../Dictionary";
import {SLTCells} from "./SLTCells";
import {SLTMatchingBoardLayer} from "./SLTMatchingBoardLayer";
import {SLTMatchingBoardGeneratorBase} from "./SLTMatchingBoardGeneratorBase";

export class SLTMatchingBoard extends SLTBoard {
    private readonly _config: SLTMatchingBoardConfig;

    /**
     * Class constructor.
     * @param config The board configuration.
     * @param propertyObjects The board associated properties.
     * @param checkpoints The board checkpoints.
     */
    constructor(config:SLTMatchingBoardConfig, propertyObjects:Dictionary<any>, checkpoints:Dictionary<any>) {
        super(config.layers, propertyObjects, checkpoints);
        this._config = config;
    }

    /**
     * The cells of the board.
     */
    public get cells():SLTCells {
        return this._config.cells;
    }

    /**
     * The number of rows.
     */
    public get rows():number {
        return this._config.rows;
    }

    /**
     * The number of columns.
     */
    public get cols():number {
        return this._config.cols;
    }

    public regenerate():void {
        for (var layerToken in this._config.layers) {
            var layer:SLTMatchingBoardLayer = this._config.layers[layerToken] as SLTMatchingBoardLayer;
            var generator:SLTMatchingBoardGeneratorBase = SLTMatchingBoardGeneratorBase.getGenerator(this._config, layer);
            generator.generate(this._config, layer);
        }
    }
}