/**
 * The SLTMatchingBoardParser class represents the matching level parser.
 */
import {SLTBoardParser} from "../SLTBoardParser";
import {SLTCells} from "./SLTCells";
import {SLTCell} from "./SLTCell";
import {SLTLevelParser} from "../SLTLevelParser";
import {Dictionary} from "../../Dictionary";
import {SLTAssetState} from "../SLTAssetState";
import {SLTBoard} from "../SLTBoard";
import {SLTChunk} from "./SLTChunk";
import {SLTMatchingBoardLayer} from "./SLTMatchingBoardLayer";
import {SLTChunkAssetRule} from "./SLTChunkAssetRule";
import {SLTCheckPointParser} from "../SLTCheckPointParser";
import {SLTMatchingBoardConfig} from "./SLTMatchingBoardConfig";
import {SLTMatchingBoard} from "./SLTMatchingBoard";
import {SLTMatchingRules} from "./SLTMatchingRules";
import {SLTChunkAssetDatum} from "./SLTChunkAssetDatum";
import {SLTAsset} from "../SLTAsset";

export class SLTMatchingBoardParser extends SLTBoardParser {

    private static initializeCells(cells: SLTCells, boardNode: any): void {
        let cols: number = cells.width;
        let rows: number = cells.height;

        for (let i: number = 0; i < cols; ++i) {
            for (let j: number = 0; j < rows; ++j) {
                let sltCell: SLTCell = new SLTCell(i, j);
                cells.insert(i, j, sltCell);
            }
        }

        let cellsArray: any[] = boardNode.cells;
        for (let k: number = 0, length: number = cellsArray.length; k < length; ++k) {
            let cellObject: any = cellsArray[k];
            let cell: SLTCell = cells.retrieve(cellObject.col, cellObject.row);
            //blocking check
            if (cellObject.hasOwnProperty("isBlocked") && true == cellObject.isBlocked) {
                cell.isBlocked = true;
            }
            //assigning cell properties
            if (cellObject.hasOwnProperty(SLTLevelParser.NODE_PROPERTY_OBJECTS)) {
                let propertyObjects: any = cellObject[SLTLevelParser.NODE_PROPERTY_OBJECTS];
                let cellProperties: Dictionary<any> = {};
                for (let propertyKey in propertyObjects) {
                    if (propertyObjects.hasOwnProperty(propertyKey)) {
                        cellProperties[propertyKey] = propertyObjects[propertyKey];
                    }
                }
                cell.properties = cellProperties;
            }
        }
    }

    oparseAssetState(stateNode: any): SLTAssetState {
        let token: string;

        if (stateNode.hasOwnProperty("token")) {
            token = stateNode.token;
        }
        return new SLTAssetState(token);
    }

    /**
     * Parses the board content.
     * @param rootNode The root node.
     * @param assetMap The asset map.
     * @return The parsed boards.
     */
    parseBoardContent(rootNode: any, assetMap: Dictionary<any>): Dictionary<any> {
        let boardNodes: any = SLTBoardParser.getBoardsNode(rootNode, SLTBoard.BOARD_TYPE_MATCHING);

        let matchingRules: SLTMatchingRules = this.parseMatchingRules(rootNode, assetMap);
        let matchingRuleIncludedBoards: any[] = this.parseMatchingRuleIncludedBoards(rootNode);

        let boards: Dictionary<any> = {};
        for (const boardNode in boardNodes) {
            let boardRelatedMatchingRules: SLTMatchingRules = new SLTMatchingRules();
            const boardToken: string = boardNodes[boardNode].token;
            if (matchingRules.matchingRuleEnabled && -1 != matchingRuleIncludedBoards.indexOf(boardToken)) {
                boardRelatedMatchingRules = matchingRules;
            }
            boards[boardToken] = this.parseLevelBoard(boardRelatedMatchingRules, boardNode, assetMap);
        }
        return boards;
    }

    private parseMatchingRules(rootNode: any, assetMap: Dictionary<SLTAsset>): SLTMatchingRules {
        let matchingRules: SLTMatchingRules = new SLTMatchingRules();
        if (rootNode.hasOwnProperty(SLTMatchingRules.MATCHING_RULES)) {
            matchingRules.matchingRuleEnabled = true;
            matchingRules.squareMatchEnabled = rootNode.matchingRules.squareMatch;
            matchingRules.matchSize = rootNode.matchingRules.matchSize;

            let excludedAssetNodes: any[] = rootNode.matchingRules.excludedAssets;
            let excludedMatchAssets: SLTChunkAssetDatum[] = [];
            for (let excludedAssetId in excludedAssetNodes) {
                excludedMatchAssets.push(new SLTChunkAssetDatum(excludedAssetId, "", assetMap));
            }
            matchingRules.excludedAssets = excludedMatchAssets;
        }
        return matchingRules;
    }

    private parseMatchingRuleIncludedBoards(rootNode: any): any[] {
        let boards: any[] = null;
        if (rootNode.hasOwnProperty(SLTMatchingRules.MATCHING_RULES)) {
            boards = rootNode.matchingRules.includedBoards;
        }
        return boards;
    }

    private parseLevelBoard(matchingRuleProperties: SLTMatchingRules, boardNode: any, assetMap: Dictionary<any>): SLTMatchingBoard {
        let boardPropertyObjects: Dictionary<any> = SLTBoardParser.parseBoardProperties(boardNode);

        let cells: SLTCells = new SLTCells(boardNode.cols, boardNode.rows);
        SLTMatchingBoardParser.initializeCells(cells, boardNode);

        let layers: Dictionary<any> = {};
        let layerNodes: any = boardNode.layers;
        for (let layerToken in layerNodes) {
            if (layerNodes.hasOwnProperty(layerToken)) {
                let layerNode: any = layerNodes[layerToken];
                layers[layerToken] = this.parseLayer(layerNode, layerToken, cells, assetMap);
            }
        }
        let config: SLTMatchingBoardConfig = new SLTMatchingBoardConfig(cells, layers, boardNode, assetMap, matchingRuleProperties);

        return new SLTMatchingBoard(boardNode.token, config, boardPropertyObjects, SLTCheckPointParser.parseCheckpoints(boardNode));
    }

    private parseLayerChunks(layer: SLTMatchingBoardLayer, chunkNodes: any[], cells: SLTCells, assetMap: Dictionary<any>): void {
        for (let i: number = 0; i < chunkNodes.length; ++i) {
            const chunkNode: any = chunkNodes[i];
            const cellNodes: any[] = chunkNode.cells;
            const chunkCells: SLTCell[] = cellNodes.map(cellNode => cells.retrieve(cellNode[0], cellNode[1]));

            const assetRuleNodes: any[] = chunkNode.assetRules;
            const chunkAssetRules: SLTChunkAssetRule[] = assetRuleNodes.map(ruleNode =>
                new SLTChunkAssetRule(ruleNode.assetId, ruleNode.distributionType, ruleNode.distributionValue, ruleNode.stateId));

            let matchingRuleEnabled: boolean = !chunkNode.hasOwnProperty("matchingRuleDisabled");

            layer.addChunk(new SLTChunk(layer.token, layer.index, chunkCells, chunkAssetRules, matchingRuleEnabled, assetMap));
        }
    }

    private parseLayer(layerNode: any, layerToken: string, cells: SLTCells, assetMap: Dictionary<any>): SLTMatchingBoardLayer {
        let layer: SLTMatchingBoardLayer = new SLTMatchingBoardLayer(layerToken, layerNode.index, layerNode.assetRules);
        this.parseLayerChunks(layer, layerNode.chunks, cells, assetMap);
        return layer;
    }
}