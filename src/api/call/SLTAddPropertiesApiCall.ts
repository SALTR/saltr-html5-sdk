import {SLTApiCall} from "./SLTApiCall";
import {SLTConfig} from "../../SLTConfig";

class SLTAddPropertiesApiCall extends SLTApiCall {

    constructor() {
        super();
    }

    public buildCall(): any {
        this._url = SLTConfig.SALTR_API_URL;
        let params: any = this.buildDefaultArgs();
        params.action = SLTConfig.ACTION_ADD_PROPERTIES;
        params.args = JSON.stringify({basicProperties: this._params.basicProperties, customProperties: this._params.customProperties},
            SLTApiCall.removeEmptyAndNullsJSONReplacer);
        return params;
    }
}

export {SLTAddPropertiesApiCall}