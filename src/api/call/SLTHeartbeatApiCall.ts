import {SLTApiCall} from "./SLTApiCall";
import {SLTConfig} from "../../SLTConfig";

class SLTHeartbeatApiCall extends SLTApiCall {

    public buildCall(): any {
        this._url = SLTConfig.SALTR_API_URL;
        const urlVars: any = {};
        urlVars.action = SLTConfig.ACTION_HEARTBEAT;

        const args: any = this.buildDefaultArgs();
        urlVars.args = JSON.stringify(args, SLTApiCall.removeEmptyAndNullsJSONReplacer);

        return urlVars;
    }

}

export {SLTHeartbeatApiCall}