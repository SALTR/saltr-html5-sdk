import {SLTApiCall} from "./SLTApiCall";
import {SLTAppData} from "../../SLTAppData";
import {SLTConfig} from "../../SLTConfig";

class SLTAppDataApiCall extends SLTApiCall {

    protected _appData: SLTAppData;

    constructor(appData: SLTAppData) {
        super();
        this._appData = appData;
    }

    public buildCall(): any {
        this._url = SLTConfig.SALTR_API_URL;
        let params: any = this.buildDefaultArgs();
        params.ping = this._params.ping;
        params.snapshotId = this._params.snapshotId;
        params.action = SLTConfig.ACTION_GET_APP_DATA;
        params.args = JSON.stringify({basicProperties: this._params.basicProperties, customProperties: this._params.customProperties},
            SLTApiCall.removeEmptyAndNullsJSONReplacer);
        return params;
    }
}

export {SLTAppDataApiCall}