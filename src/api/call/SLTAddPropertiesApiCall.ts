import {SLTApiCall} from "./SLTApiCall";
import {SLTConfig} from "../../SLTConfig";

class SLTAddPropertiesApiCall extends SLTApiCall {

    constructor() {
        super();
    }

    public buildCall(): any {
        this._url = SLTConfig.SALTR_API_URL;
        const urlVars: any = {};
        urlVars.action = SLTConfig.ACTION_ADD_PROPERTIES;

        const args: any = this.buildDefaultArgs();
        args.basicProperties = this._params.basicProperties;
        args.customProperties = this._params.customProperties;

        urlVars.args = JSON.stringify(args, SLTApiCall.removeEmptyAndNullsJSONReplacer);
        return urlVars;
    }
}

export {SLTAddPropertiesApiCall}