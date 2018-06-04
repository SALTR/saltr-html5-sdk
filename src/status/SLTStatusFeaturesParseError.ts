/**
 * The SLTStatusFeaturesParseError class represents the client features parse error status.
 */
import {SLTStatus} from "./SLTStatus";

export class SLTStatusFeaturesParseError extends SLTStatus {


   constructor() {
        super(SLTStatus.CLIENT_FEATURES_PARSE_ERROR, "[SALTR] Failed to decode Features.");
    }
}