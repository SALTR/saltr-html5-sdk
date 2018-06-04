import {Dictionary} from "../Dictionary";
import {SLTCheckpoint} from "./SLTCheckpoint";

export class SLTCheckPointParser {
    constructor(){

    }

    static parseCheckpoints(rootNode:any):Dictionary<any> {
        const checkpoints: Dictionary<any> = {};
        if (rootNode.hasOwnProperty("checkpoints")) {
            const checkpointsNode: any = rootNode.checkpoints;
            for (let token in checkpointsNode) {
                const checkpointObject: any = checkpointsNode[token];
                checkpoints[token] = new SLTCheckpoint(token, checkpointObject.orientation, checkpointObject.position);
            }
        }
        return checkpoints;
    }
}