import {SLTAssetState} from "./SLTAssetState";
import {Dictionary} from "../Dictionary";
import {SLTLevelParser} from "./SLTLevelParser";

export class SLTBoardParser {
    static getBoardsNode(rootNode: any, type: string): any {
        let boardsNode: any = null;
        if (rootNode["boards"].hasOwnProperty(type)) {
            boardsNode = rootNode["boards"][type];
        }
        return boardsNode;
    }

    constructor() {
    }

    parseAssetState(stateNode: any): SLTAssetState {
        throw new Error("[SALTR: ERROR] parseAssetState() is virtual method.");
    }

    parseBoardContent(rootNode: any, assetMap: Dictionary<any>): Dictionary<any> {
        throw new Error("[SALTR: ERROR] parseBoardContent() is virtual method.");
    }

    protected static parseBoardProperties(boardNode: any): Dictionary<any> {
        const boardProperties: Dictionary<any> = {};
        if (boardNode.hasOwnProperty(SLTLevelParser.NODE_PROPERTY_OBJECTS)) {
            const propertyNodes: any = boardNode[SLTLevelParser.NODE_PROPERTY_OBJECTS];
            for (let propertyToken in propertyNodes) {
                if (propertyNodes.hasOwnProperty(propertyToken)) {
                    boardProperties[propertyToken] = propertyNodes[propertyToken];
                }
            }
        }
        return boardProperties;
    }
}