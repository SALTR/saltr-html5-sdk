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

export class SLTMatchingBoardGeneratorBase {
   static getGenerator(boardConfig:SLTMatchingBoardConfig, layer:SLTMatchingBoardLayer):SLTMatchingBoardGeneratorBase {
        if (boardConfig.matchingRulesEnabled && SLTMatchingBoardGeneratorBase.isMatchingRuleEnabledLayer(layer)) {
            return SLTMatchingBoardRulesEnabledGenerator.getInstance();
        } else {
            return SLTMatchingBoardGenerator.getInstance();
        }
    }

    private static isMatchingRuleEnabledLayer(layer:SLTMatchingBoardLayer):boolean {
        let matchingRuleEnabled: boolean = false;
        for (let i:number = 0, length:number = layer.chunks.length; i < length; ++i) {
            const chunk: SLTChunk = layer.chunks[i];
            if (chunk.matchingRuleEnabled) {
                matchingRuleEnabled = true;
                break;
            }
        }
        return matchingRuleEnabled;
    }

   generate(boardConfig:SLTMatchingBoardConfig, layer:SLTMatchingBoardLayer):void {
        throw new Error("Abstract method error");
    }

    protected generateAssetData(chunks:SLTChunk[]):void {
        for (let i:number = 0, len:number = chunks.length; i < len; ++i) {
            chunks[i].generateAssetData();
        }
    }

    protected parseFixedAssets(layer:SLTMatchingBoardLayer, cells:SLTCells, assetMap:Dictionary<any>):void {
        const assetNodes: any[] = layer.assetRules;
        //creating fixed asset instances and assigning them to cells where they belong
        for (let i:number = 0, iLen:number = assetNodes.length; i < iLen; ++i) {
            const assetInstanceNode: any = assetNodes[i];
            const asset: SLTAsset = assetMap[assetInstanceNode.assetId] as SLTAsset;
            const stateId: string = assetInstanceNode.stateId;
            const cellPositions: any[] = assetInstanceNode.cells;

            for (let j:number = 0, jLen:number = cellPositions.length; j < jLen; ++j) {
                const position: any[] = cellPositions[j];
                const cell: SLTCell = cells.retrieve(position[0], position[1]);
                cell.removeAssetInstance(layer.token, layer.index);
                cell.setAssetInstance(layer.token, layer.index, new SLTAssetInstance(asset.token, asset.getInstanceState(stateId), asset.properties));
            }
        }
    }

    protected fillLayerChunkAssets(chunks:SLTChunk[]):void {
        for (let i:number = 0, chunksLength:number = chunks.length; i < chunksLength; ++i) {
            const chunk: SLTChunk = chunks[i];
            const availableAssetData: SLTChunkAssetDatum[] = chunk.availableAssetData.concat();
            const chunkCells: SLTCell[] = chunk.cells.concat();
            for (let j:number = 0, cellsLength:number = chunkCells.length; j < cellsLength; ++j) {
                const assetDatumRandIndex: number = Math.random() * availableAssetData.length;
                const assetDatum: SLTChunkAssetDatum = availableAssetData[assetDatumRandIndex];
                availableAssetData.splice(assetDatumRandIndex, 1);
                chunk.addAssetInstanceWithCellIndex(assetDatum, j);
            }
        }
    }
}