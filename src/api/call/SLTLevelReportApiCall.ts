import {SLTApiCall} from "./SLTApiCall";
import {SLTConfig} from "../../SLTConfig";

class SLTLevelReportApiCall extends SLTApiCall {

    constructor() {
        super();
    }

    public buildCall(): any {
        this._url = SLTConfig.SALTR_DEVAPI_URL;
        let params: any = this.buildDefaultArgs();
        params.action = SLTConfig.ACTION_LEVEL_REPORT;
        params.args = JSON.stringify({levelReportEventProperties: this._params.levelReportEventProperties}, SLTApiCall.removeEmptyAndNullsJSONReplacer);
        return params;
    }
}

export {SLTLevelReportApiCall}