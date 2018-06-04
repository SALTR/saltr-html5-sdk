import {SLTApiCall} from "./SLTApiCall";
import {SLTConfig} from "../../SLTConfig";

class SLTLevelReportApiCall extends SLTApiCall {

    constructor() {
        super();
    }

    public buildCall(): any {
        this._url = SLTConfig.SALTR_DEVAPI_URL;
        let args: any = this.buildDefaultArgs();
        args.action = SLTConfig.ACTION_LEVEL_REPORT;
        args.levelReportEventProperties = this._params.levelReportEventProperties;
        return args;
    }
}

export {SLTLevelReportApiCall}