import {SLTStatus} from "./SLTStatus";

export class SLTStatusAppDataLoadFail extends SLTStatus {

    constructor() {
        super('CLIENT_APP_DATA_LOAD_FAIL', '[SALTR] Failed to load appData');
    }
}