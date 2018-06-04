import {SLTStatus} from "./SLTStatus";

export class SLTStatusAppDataParseError extends SLTStatus {

    constructor() {
        super(SLTStatus.CLIENT_APP_DATA_PARSE_ERROR, '[SALTR] Failed to decode appData.');
    }
}