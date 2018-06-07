import {Dictionary} from "../Dictionary";
import {SLTMatchingBoardParser} from "./matching/SLTMatchingBoardParser";
import {SLT2DBoardParser} from "./canvas2d/SLT2DBoardParser";
import {SLTBoardParser} from "./SLTBoardParser";
import {SLTAsset} from "./SLTAsset";
import {SLTAssetState} from "./SLTAssetState";
import {SLTBoard} from "./SLTBoard";
import {SLTMultiCellAsset} from "./matching/SLTMultiCellAsset";


class SLTLevelParser {

    public static readonly NODE_PROPERTY_OBJECTS: string = "propertyObjects";

    private static INSTANCE: SLTLevelParser;

    private _matchingBoardParser: SLTMatchingBoardParser;
    private _canvas2dBoardParser: SLT2DBoardParser;

    public static getInstance(): SLTLevelParser {
        if (!this.INSTANCE) {
            this.INSTANCE = new SLTLevelParser();
        }
        return this.INSTANCE;
    }

    private constructor() {
    }

    parseLevelProperties(rootNode: any): Dictionary<any> {
        if (rootNode.hasOwnProperty(SLTLevelParser.NODE_PROPERTY_OBJECTS)) {
            var properties: Dictionary<any> = {};
            var levelPropertyNodes: any = rootNode[SLTLevelParser.NODE_PROPERTY_OBJECTS];
            for (var token in levelPropertyNodes) {
                properties[token] = levelPropertyNodes[token];
            }
            return properties;
        }
        return null;
    }

    /**
     * Parses the board content.
     * @param rootNode The root node.
     * @param assetMap The asset map.
     * @param boardType The board type.
     * @return The parsed boards.
     */
    parseBoardContent(rootNode: any, assetMap: Dictionary<any>, boardType: string): Dictionary<any> {
        const boardParser: SLTBoardParser = this.getBoardParser(boardType);
        return boardParser.parseBoardContent(rootNode, assetMap);
    }

    /**
     * Parses the level assets.
     * @return The parsed assets.
     */
    parseAssets(rootNode: any, boardType: string): Dictionary<any> {
        let assetMap: Dictionary<any> = null;
        if (rootNode["assets"].hasOwnProperty(boardType)) {
            const assetNodes: any = rootNode["assets"][boardType];
            assetMap = {};
            for (let assetId in assetNodes) {
                assetMap[assetId] = this.parseAsset(assetNodes[assetId], boardType);
            }
        }
        return assetMap;
    }

    //Parsing assets here
    private parseAsset(assetNode: any, boardType: string): SLTAsset {
        let token: string;
        let statesMap: Dictionary<any>;
        let properties: any = null;
        let asset: SLTAsset;

        if (assetNode.hasOwnProperty("token")) {
            token = assetNode.token;
        }

        if (assetNode.hasOwnProperty("states")) {
            statesMap = this.parseAssetStates(assetNode.states, boardType);
        }

        if (assetNode.hasOwnProperty("properties")) {
            properties = assetNode.properties;
        }

        if (assetNode.hasOwnProperty("startPoint")) {
            asset = new SLTMultiCellAsset(token, assetNode.cells, assetNode.startPoint, statesMap, properties);
        }
        else {
            asset = new SLTAsset(token, statesMap, properties);
        }

        return asset;
    }

    private parseAssetStates(stateNodes: any, boardType: string): Dictionary<any> {
        const statesMap: Dictionary<any> = {};
        for (const stateId in stateNodes) {
            statesMap[stateId] = this.parseAssetState(stateNodes[stateId], boardType);
        }
        return statesMap;
    }

    private parseAssetState(stateNode: any, boardType: string): SLTAssetState {
        const boardParser: SLTBoardParser = this.getBoardParser(boardType);
        return boardParser.parseAssetState(stateNode);
    }

    private getBoardParser(boardType: string): SLTBoardParser {
        if (SLTBoard.BOARD_TYPE_MATCHING == boardType) {
            return this._matchingBoardParser;
        } else if (SLTBoard.BOARD_TYPE_CANVAS_2D == boardType) {
            return this._canvas2dBoardParser;
        } else {
            throw new Error("Board parser missing error");
        }
    }
}

export {SLTLevelParser}