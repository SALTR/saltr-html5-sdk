import {Dictionary} from "../Dictionary";
import {SLTMatchingBoardParser} from "./matching/SLTMatchingBoardParser";
import {SLT2DBoardParser} from "./canvas2d/SLT2DBoardParser";


class SLTLevelParser {

    public static readonly NODE_PROPERTY_OBJECTS: string = "propertyObjects";

    private static INSTANCE: SLTLevelParser;

    private _matchingBoardParser:SLTMatchingBoardParser;
    private _canvas2dBoardParser:SLT2DBoardParser;

    public static getInstance(): SLTLevelParser {
        if (!this.INSTANCE) {
            this.INSTANCE = new SLTLevelParser();
        }
        return this.INSTANCE;
    }

    public parseLevelProperties(rootNode: any): Dictionary<any> {
        if (rootNode.hasOwnProperty(SLTLevelParser.NODE_PROPERTY_OBJECTS)) {
            let properties: Dictionary<any> = {};
            let levelPropertyNodes: any = rootNode[SLTLevelParser.NODE_PROPERTY_OBJECTS];
            for (let key in levelPropertyNodes) {
                if (levelPropertyNodes.hasOwnProperty(key)) {
                    properties[key] = levelPropertyNodes[key];
                }
            }
            return properties;
        }
        return null;
    }

    public parseAssets(rootNode: any, boardType: string): Dictionary<any> {
        return {};
    }

    public parseBoardContent(rootNode: any, assetMap: Dictionary<any>, boardType: string): Dictionary<any> {
        return {};
    }
}

export {SLTLevelParser}