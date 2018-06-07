import {SLTApiCall} from "./SLTApiCall";
import {SLTResourceURLTicket} from "../../resource/SLTResourceURLTicket";
import {URLRequestMethod} from "../../URLRequestMethod";
import {SLTResource} from "../../resource/SLTResource";
import {SLTApiCallResult} from "./SLTApiCallResult";

class SLTLevelContentApiCall extends SLTApiCall {
    private _alternateUrl:string;

    constructor() {
        super();
    }

    validateDefaultWebParams(): any {
        const contentURL: string = this._params.contentUrl;
        if (contentURL == null || contentURL == "") {
            return {isValid: false, message: "Missing contentUrl."};
        }
        return {isValid: true};
    }

    buildCall():any {
        this._url = this._params.contentUrl;
        this._alternateUrl = this._params.alternateUrl;
        return { method: 'GET'};
    }

    getURLTicket(urlVars:any, timeout:number):SLTResourceURLTicket {
        return SLTApiCall.getTicket(this._url, urlVars, timeout);
    }

    callRequestCompletedHandler(resource:SLTResource):void {
        const content: any = resource.data;
        const apiCallResult: SLTApiCallResult = new SLTApiCallResult();
        apiCallResult.success = content != null && content != undefined;
        apiCallResult.data = content;
        this.handleResult(apiCallResult);
    }

    callRequestFailHandler(resource:SLTResource):void {
        if (this._alternateUrl) {
            const ticket: SLTResourceURLTicket = new SLTResourceURLTicket(this._alternateUrl);

            new SLTResource(ticket, this.alternateCallRequestCompletedHandler, this.alternateCallRequestFailHandler).load();
        }
        else {
            this.alternateCallRequestFailHandler(resource);
        }
    }

    private alternateCallRequestCompletedHandler(resource:SLTResource):void {
        this.callRequestCompletedHandler(resource);
    }

    private alternateCallRequestFailHandler(resource:SLTResource):void {
        super.callRequestFailHandler(resource);
    }

}

export {SLTLevelContentApiCall}