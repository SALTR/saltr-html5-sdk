import {SLTStatus} from "./SLTStatus";

export class SLTStatusAppDataLoadFail extends SLTStatus {

    constructor() {
        super(SLTStatus.CLIENT_APP_DATA_LOAD_FAIL, '[SALTR] Failed to load appData');
    }
}