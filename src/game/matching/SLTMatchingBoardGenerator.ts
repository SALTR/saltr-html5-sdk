import {SLTMatchingBoardConfig} from "./SLTMatchingBoardConfig";
import {SLTMatchingBoardLayer} from "./SLTMatchingBoardLayer";
import {SLTMatchingBoardGeneratorBase} from "./SLTMatchingBoardGeneratorBase";

export class SLTMatchingBoardGenerator extends SLTMatchingBoardGeneratorBase {
    private static INSTANCE: SLTMatchingBoardGenerator;

    private _boardConfig: SLTMatchingBoardConfig;
    private _layer: SLTMatchingBoardLayer;

    static getInstance(): SLTMatchingBoardGenerator {
        if (!SLTMatchingBoardGenerator.INSTANCE) {
            SLTMatchingBoardGenerator.INSTANCE = new SLTMatchingBoardGenerator();
        }
        return SLTMatchingBoardGenerator.INSTANCE;
    }

    private constructor() {
        super();
    }

    generate(boardConfig: SLTMatchingBoardConfig, layer: SLTMatchingBoardLayer): void {
        this._boardConfig = boardConfig;
        this._layer = layer;
        super.parseFixedAssets(layer, this._boardConfig.cells, this._boardConfig.assetMap);
        super.generateAssetData(this._layer.chunks);
        super.fillLayerChunkAssets(this._layer.chunks);
    }
}