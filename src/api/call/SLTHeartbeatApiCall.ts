import {SLTApiCall} from "./SLTApiCall";
import {SLTConfig} from "../../SLTConfig";

class SLTHeartbeatApiCall extends SLTApiCall {
    public buildCall(): any {
        this._url = SLTConfig.SALTR_API_URL;
        let args: any = this.buildDefaultArgs();
        args.action = SLTConfig.ACTION_HEARTBEAT;
        return args;
    }

}

export {SLTHeartbeatApiCall}