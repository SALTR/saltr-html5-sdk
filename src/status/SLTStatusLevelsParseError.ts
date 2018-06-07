import {SLTStatus} from "./SLTStatus";

class SLTStatusLevelsParseError extends SLTStatus {

    constructor() {
        super('CLIENT_LEVELS_PARSE_ERROR', '[SALTR] Failed to decode Levels');
    }
}

export {SLTStatusLevelsParseError}