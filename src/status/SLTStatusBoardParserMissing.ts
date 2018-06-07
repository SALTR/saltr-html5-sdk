/**
 * The SLTStatusBoardParserMissing class represents the client levels parse error.
 */
import {SLTStatus} from "./SLTStatus";

class SLTStatusBoardParserMissing extends SLTStatus {

    constructor() {
        super('CLIENT_BOARD_PARSE_ERROR', "[SALTR] Failed to find parser for current board type..");
    }
}

export {SLTStatusBoardParserMissing}