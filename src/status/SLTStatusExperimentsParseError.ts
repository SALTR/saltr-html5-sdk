/**
 * The SLTStatusExperimentsParseError class represents the client experiments parse error status.
 */
import {SLTStatus} from "./SLTStatus";

class SLTStatusExperimentsParseError extends SLTStatus {
   constructor() {
        super('CLIENT_EXPERIMENTS_PARSE_ERROR', "[SALTR] Failed to decode Experiments.");
    }
}

export {SLTStatusExperimentsParseError}