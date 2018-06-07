import {SLTAppDataApiCall} from "./SLTAppDataApiCall";
import {SLTAppData} from "../../SLTAppData";
import {SLTLogger} from "../../utils/SLTLogger";
import {SLTStatusAppDataParseError} from "../../status/SLTStatusAppDataParseError";
import {SLTStatusAppDataLoadFail} from "../../status/SLTStatusAppDataLoadFail";
import {SLTStatus} from "../../status/SLTStatus";
import {SLTFeature} from "../../SLTFeature";
import {Dictionary} from "../../Dictionary";

class SLTWebAppDataApiCall extends SLTAppDataApiCall {

    private _originalSuccessCallback: (...args: any[]) => void;
    private _originalFailCallback: (...args: any[]) => void;

    public call(params: any, successCallback: (...args: any[]) => void = null, failCallback: (...args: any[]) => void = null,
                nativeTimeout: number = 0, timeout: number = 0): void {
        super.call(params, this.wrappedSuccessCallback, this.wrappedFailCallback, timeout);

        this._originalFailCallback = failCallback;
        this._originalSuccessCallback = successCallback;

    }

    private wrappedSuccessCallback(data: any): void {
        SLTLogger.getInstance().log("New app data request from connect() succeed.");

        if (this.processNewAppData(data)) {
            this._originalSuccessCallback(this._appData);
        }
        else {
            this._originalFailCallback(new SLTStatusAppDataParseError());
        }
    }

    private wrappedFailCallback(status: SLTStatus): void {
        SLTLogger.getInstance().log("New app data request from connect() failed. StatusCode: " + status.statusCode);

        if (status.statusCode == 'API_ERROR') {
            this._originalFailCallback(new SLTStatusAppDataLoadFail());
        }
        else {
            this._originalFailCallback(status);
        }
    }

    private processNewAppData(data: any): boolean {
        try {
            this._appData.initWithData(data);

        }
        catch (e) {
            SLTLogger.getInstance().log("New app data process failed.");
            return false;
        }

        SLTLogger.getInstance().log("New app data processed.");
        return true;
    }

}

export {SLTWebAppDataApiCall}