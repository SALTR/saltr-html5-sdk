import {SLTStatus} from "../../status/SLTStatus";
import {SLTResourceURLTicket} from "../../resource/SLTResourceURLTicket";
import {URLRequestMethod} from "../../URLRequestMethod";
import {SLTApiCallResult} from "./SLTApiCallResult";
import {SLTResource} from "../../resource/SLTResource";
import {SLTLevelContentApiCall} from "./SLTLevelContentApiCall";

class SLTApiCall {
    protected _url: string;
    protected _params: any;
    protected _successCallback: (...args: any[]) => void;
    protected _failCallback: (...args: any[]) => void;

    public static removeEmptyAndNullsJSONReplacer(k: any, v: any): any {
        if (v != null && v != "null" && v !== "" && typeof v !== "undefined") {
            return v;
        }
        return undefined;
    }

    public static getTicket(url: string, vars: any, timeout: number = 0): SLTResourceURLTicket {
        let ticket: SLTResourceURLTicket = new SLTResourceURLTicket(url, vars);
        if (timeout > 0) {
            ticket.idleTimeout = timeout;
        }
        return ticket;
    }

    public constructor() {
    }

    public call(params: any, successCallback: (...args: any[]) => void = null, failCallback: (...args: any[]) => void = null,
                timeout: number = 0): void {
        this._params = params;
        this._successCallback = successCallback;
        this._failCallback = failCallback;
        let validationResult: any = this.validateDefaultWebParams();
        if (validationResult.isValid == false) {
            this.returnValidationFailedResult(validationResult.message);
            return;
        }
        const urlVars: any = this.buildCall();
        this.doCall(urlVars, timeout);
    }

    private returnValidationFailedResult(message: string): void {
        let apiCallResult: SLTApiCallResult = new SLTApiCallResult();
        apiCallResult.success = false;
        apiCallResult.status = new SLTStatus('API_ERROR', message);
        this.handleResult(apiCallResult);
    }

    private doCall(urlVars: any, timeout: number): void {
        let ticket: SLTResourceURLTicket = this.getURLTicket(urlVars, timeout);
        let resource: SLTResource = new SLTResource(ticket, this.callRequestCompletedHandler.bind(this),
            this.callRequestFailHandler.bind(this));
        resource.load();
    }

    public getURLTicket(urlVars: any, timeout: number): SLTResourceURLTicket {
        return SLTApiCall.getTicket(this._url, urlVars, timeout);
    }

    public callRequestCompletedHandler(resource: SLTResource): void {
        let jsonData: any = resource.data;
        let success: boolean = false;
        let apiCallResult: SLTApiCallResult = new SLTApiCallResult();
        let response: any;
        if (jsonData && jsonData.hasOwnProperty("response")) {
            response = jsonData.response[0];
            success = response.success;
            if (success) {
                apiCallResult.data = response;
            }
            else {
                apiCallResult.status = new SLTStatus(response.error.code, response.error.message);
            }
        }
        else {
            apiCallResult.status = new SLTStatus('API_ERROR', "unknown API error: wrong response");
        }

        apiCallResult.success = success;
        this.handleResult(apiCallResult);
    }

    public callRequestFailHandler(resource: SLTResource): void {
        let apiCallResult: SLTApiCallResult = new SLTApiCallResult();
        apiCallResult.status = new SLTStatus('API_ERROR', "API call request failed.");
        this.handleResult(apiCallResult);
    }


    public buildCall(): any {
        throw new Error("abstract method call error");
    }

    public validateDefaultWebParams(): any {
        if (this._params.socialId == null) {
            return {isValid: false, message: "Field socialId is required"};
        }
        if (this._params.clientKey == null) {
            return {isValid: false, message: "Field clientKey is required"};
        }
        return {isValid: true};
    }

    public buildDefaultArgs(): any {
        let args: any = {};

        args.socialId = this._params.socialId;
        args.apiVersion = "1.9.0";
        args.clientKey = this._params.clientKey;
        args.client = "html5";
        args.devMode = this._params.devMode;
        return args;
    }

    public handleResult(result: SLTApiCallResult): void {
        if (result.success) {
            if (this._successCallback) {
                this._successCallback(result.data);
            }
        } else if (this._failCallback) {
            this._failCallback(result.status);
        }

    }

}

export {SLTApiCall}