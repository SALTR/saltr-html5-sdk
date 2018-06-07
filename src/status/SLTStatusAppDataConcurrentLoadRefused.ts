import {SLTStatus} from "./SLTStatus";

export class SLTStatusAppDataConcurrentLoadRefused extends SLTStatus {

    constructor() {
        super('CLIENT_APP_DATA_CONCURRENT_LOAD_REFUSED', '[SALTR] appData load refused. Previous load is not complete');
    }
}