import {SLTApiCall} from "./SLTApiCall";
import {SLTConfig} from "../../SLTConfig";

class SLTLevelReportApiCall extends SLTApiCall {

    public buildCall(): any {
        this._url = SLTConfig.SALTR_DEVAPI_URL;
        const urlVars: any = {};
        urlVars.action = SLTConfig.ACTION_LEVEL_REPORT;

        const args: any = this.buildDefaultArgs();
        args.levelReportEventProperties = this._params.levelReportEventProperties;

        urlVars.args = JSON.stringify(args, SLTApiCall.removeEmptyAndNullsJSONReplacer);
        return args;
    }
}

export {SLTLevelReportApiCall}