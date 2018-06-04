import {SLTApiCall} from "./SLTApiCall";
import {SLTResourceURLTicket} from "../../resource/SLTResourceURLTicket";
import {URLRequestMethod} from "../../URLRequestMethod";
import {SLTResource} from "../../resource/SLTResource";
import {SLTApiCallResult} from "./SLTApiCallResult";

class SLTLevelContentApiCall extends SLTApiCall {

    validateDefaultWebParams(): any {
        const contentURL: string = this._params.contentUrl;
        if (contentURL == null || contentURL == "") {
            return {isValid: false, message: "Missing contentUrl."};
        }
        return {isValid: true};
    }

    buildCall():any {
        this._url = this._params.contentUrl + "?_time_=" + new Date().getTime();
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

}

export {SLTLevelContentApiCall}