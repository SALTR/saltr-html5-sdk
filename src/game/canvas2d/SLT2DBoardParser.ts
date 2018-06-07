import {SLT2DAssetState} from "./SLT2DAssetState";
import {SLTAssetState} from "../SLTAssetState";
import {SLTBoard} from "../SLTBoard";
import {Dictionary} from "../../Dictionary";
import {SLT2DBoard} from "./SLT2DBoard";
import {SLT2DBoardLayer} from "./SLT2DBoardLayer";
import {SLT2DBoardConfig} from "./SLT2DBoardConfig";
import {SLTCheckPointParser} from "../SLTCheckPointParser";
import {SLTBoardParser} from "../SLTBoardParser";

export class SLT2DBoardParser extends SLTBoardParser {
    parseAssetState(stateNode:any):SLTAssetState {
        const token: string = stateNode.hasOwnProperty("token") ? stateNode.token : null;
        const pivotX: number = stateNode.hasOwnProperty("pivotX") ? stateNode.pivotX : 0;
        const pivotY: number = stateNode.hasOwnProperty("pivotY") ? stateNode.pivotY : 0;
        const width: number = stateNode.hasOwnProperty("width") ? stateNode.width : 0;
        const height: number = stateNode.hasOwnProperty("height") ? stateNode.height : 0;
        return new SLT2DAssetState(token, pivotX, pivotY, width, height);
    }

    /**
     * Parses the board content.
     * @param rootNode The root node.
     * @param assetMap The asset map.
     * @return The parsed boards.
     */
    parseBoardContent(rootNode:any, assetMap:Dictionary<any>):Dictionary<any> {
        const boardNodes: any = this.getBoardsNode(rootNode, SLTBoard.BOARD_TYPE_CANVAS_2D);

        const boards: Dictionary<any> = {};
        for (let boardId in boardNodes) {
            const boardNode: any = boardNodes[boardId];
            boards[boardId] = this.parseLevelBoard(boardNode, assetMap);
        }
        return boards;
    }

    private parseLevelBoard(boardNode:any, assetMap:Dictionary<any>):SLT2DBoard {
        const boardPropertyanys: Dictionary<any> = this.parseBoardProperties(boardNode);

        const layers: Dictionary<any> = {};
        const layerNodes: any = boardNode.layers;
        for (const layerToken in layerNodes) {
            const layerNode: any = layerNodes[layerToken];
            const layer: SLT2DBoardLayer = this.parseLayer(layerNode, layerToken, assetMap);
            layers[layerToken] = layer;
        }

        const config: SLT2DBoardConfig = new SLT2DBoardConfig(layers, boardNode, assetMap);
        return new SLT2DBoard(boardNode.token, config, boardPropertyanys, SLTCheckPointParser.parseCheckpoints(boardNode));
    }

    private parseLayer(layerNode:any, layerToken:string, assetMap:Dictionary<any>):SLT2DBoardLayer {
        return new SLT2DBoardLayer(layerToken, layerNode.index, layerNode.assetRules);
    }
}