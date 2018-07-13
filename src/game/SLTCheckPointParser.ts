import {Dictionary} from "../Dictionary";
import {SLTCheckpoint} from "./SLTCheckpoint";

export class SLTCheckPointParser {

    static parseCheckpoints(rootNode:any):Dictionary<any> {
        const checkpoints: Dictionary<any> = {};
        if (rootNode.hasOwnProperty("checkpoints")) {
            const checkpointsNode: any = rootNode.checkpoints;
            for (let token in checkpointsNode) {
                if (checkpointsNode.hasOwnProperty(token)) {
                    const checkpointObject: any = checkpointsNode[token];
                    checkpoints[token] = new SLTCheckpoint(token, checkpointObject.orientation, checkpointObject.position);
                }
            }
        }
        return checkpoints;
    }
}