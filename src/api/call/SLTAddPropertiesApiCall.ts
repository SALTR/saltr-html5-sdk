import {SLTApiCall} from "./SLTApiCall";
import {SLTConfig} from "../../SLTConfig";

class SLTAddPropertiesApiCall extends SLTApiCall {

    constructor() {
        super();
    }

    public buildCall(): any {
        this._url = SLTConfig.SALTR_API_URL;
        let args: any = this.buildDefaultArgs();
        args.action = SLTConfig.ACTION_ADD_PROPERTIES;
        args.basicProperties = this._params.basicProperties;
        args.customProperties = this._params.customProperties;
        return args;
    }
}

export {SLTAddPropertiesApiCall}