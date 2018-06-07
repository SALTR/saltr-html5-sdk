import {SLTMatchingBoardConfig} from "./SLTMatchingBoardConfig";
import {SLTMatchingBoardLayer} from "./SLTMatchingBoardLayer";
import {SLTMatchingBoardRulesEnabledGenerator} from "./SLTMatchingBoardRulesEnabledGenerator";
import {SLTChunk} from "./SLTChunk";
import {SLTCells} from "./SLTCells";
import {Dictionary} from "../../Dictionary";
import {SLTAsset} from "../SLTAsset";
import {SLTCell} from "./SLTCell";
import {SLTAssetInstance} from "../SLTAssetInstance";
import {SLTChunkAssetDatum} from "./SLTChunkAssetDatum";
import {SLTMatchingBoardGenerator} from "./SLTMatchingBoardGenerator";
import {SLTMultiCellAsset} from "./SLTMultiCellAsset";
import {SLTMultiCellAssetInstance} from "./SLTMultiCellAssetInstance";
import {SLTMatchingAssetPlaceHolder} from "../SLTMatchingAssetPlaceHolder";

export class SLTMatchingBoardGeneratorBase {
    static getGenerator(boardConfig: SLTMatchingBoardConfig, layer: SLTMatchingBoardLayer): SLTMatchingBoardGeneratorBase {
        if (boardConfig.matchingRulesEnabled && SLTMatchingBoardGeneratorBase.isMatchingRuleEnabledLayer(layer)) {
            return SLTMatchingBoardRulesEnabledGenerator.getInstance();
        } else {
            return SLTMatchingBoardGenerator.getInstance();
        }
    }

    private static isMatchingRuleEnabledLayer(layer: SLTMatchingBoardLayer): boolean {
        let matchingRuleEnabled: boolean = false;
        for (let i: number = 0, length: number = layer.chunks.length; i < length; ++i) {
            const chunk: SLTChunk = layer.chunks[i];
            if (chunk.matchingRuleEnabled) {
                matchingRuleEnabled = true;
                break;
            }
        }
        return matchingRuleEnabled;
    }

    generate(boardConfig: SLTMatchingBoardConfig, layer: SLTMatchingBoardLayer): void {
        throw new Error("Abstract method error");
    }

    protected generateAssetData(chunks:SLTChunk[]):void {
        chunks.forEach(chunk => chunk.generateAssetData());
    }

    protected parseFixedAssets(layer: SLTMatchingBoardLayer, cells: SLTCells, assetMap: Dictionary<any>): void {
        const assetNodes: any[] = layer.assetRules;
        //creating fixed asset instances and assigning them to cells where they belong
        for (let i: number = 0, iLen: number = assetNodes.length; i < iLen; ++i) {
            const assetInstanceNode: any = assetNodes[i];
            const asset: SLTAsset = assetMap[assetInstanceNode.assetId] as SLTAsset;
            const stateId: string = assetInstanceNode.stateId;

            const cell: SLTCell = cells.retrieve(assetInstanceNode.col, assetInstanceNode.row);
            cell.removeAssetInstance(layer.token, layer.index);
            const positions: any = this.getAssetInstancePositions(assetInstanceNode);
            let assetInstance: SLTAssetInstance;
            if (asset instanceof SLTMultiCellAsset) {
                const multiCellAsset: SLTMultiCellAsset = asset as SLTMultiCellAsset;
                assetInstance = new SLTMultiCellAssetInstance(asset.token, asset.getInstanceState(stateId), asset.properties, multiCellAsset.cells, multiCellAsset.startPoint, positions);
            }
            else {
                assetInstance = new SLTAssetInstance(asset.token, asset.getInstanceState(stateId), asset.properties, positions);
            }
            cell.setAssetInstance(layer.token, layer.index, assetInstance);
        }
    }

    protected fillLayerChunkAssets(chunks: SLTChunk[]): void {
        for (let i: number = 0, chunksLength: number = chunks.length; i < chunksLength; ++i) {
            const chunk: SLTChunk = chunks[i];
            const availableAssetData: SLTChunkAssetDatum[] = chunk.availableAssetData.concat();
            const chunkCells: SLTCell[] = chunk.cells.concat();
            for (let j: number = 0, cellsLength: number = chunkCells.length; j < cellsLength; ++j) {
                const assetDatumRandIndex: number = Math.random() * availableAssetData.length;
                const assetDatum: SLTChunkAssetDatum = availableAssetData[assetDatumRandIndex];
                availableAssetData.splice(assetDatumRandIndex, 1);
                chunk.addAssetInstanceWithCellIndex(assetDatum, j);
            }
        }
    }

    private getAssetInstancePositions(assetInstanceNode: any): any[] {
        const positions: any[] = [];
        const positionsArray: any = assetInstanceNode.hasOwnProperty("altPositions") ? assetInstanceNode.altPositions as any[] : [];
        const positionsCount: number = positionsArray.length;
        for (let i: number = 0; i < positionsCount; ++i) {
            const positionObject: any = positionsArray[i];
            const placeHolder: SLTMatchingAssetPlaceHolder = new SLTMatchingAssetPlaceHolder(positionObject.col, positionObject.row, positionObject.tags);
            positions.push(placeHolder);
        }
        return positions;
    }
}