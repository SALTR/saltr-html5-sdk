/**
 * The SLTStatusLevelContentLoadFail class represents the client level content load fail status.
 */
import {SLTStatus} from "./SLTStatus";

export class SLTStatusLevelContentLoadFail extends SLTStatus {
    constructor() {
        super('CLIENT_LEVEL_CONTENT_LOAD_FAIL', "Level content load has failed.");
    }
}