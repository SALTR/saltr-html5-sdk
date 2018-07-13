import {SLTApiCall} from "./SLTApiCall";
import {SLTConfig} from "../../SLTConfig";

export class SLTSendLevelEndEventApiCall extends SLTApiCall {

    constructor() {
        super();
    }

    buildCall(): any {
        this._url = SLTConfig.SALTR_DEVAPI_URL;
        const urlVars: any = {};
        urlVars.action = SLTConfig.ACTION_DEV_ADD_LEVELEND_EVENT;

        const args: any = this.buildDefaultArgs();
        args.variationId = this._params.variationId;

        const eventProps: any = {};
        eventProps.endReason = this._params.endReason;
        eventProps.endStatus = this._params.endStatus;
        eventProps.score = this._params.score;
        this.addLevelEndEventProperties(eventProps, this._params.customNumbericProperties, this._params.customTextProperties);

        args.eventProps = eventProps;

        urlVars.args = JSON.stringify(args, SLTApiCall.removeEmptyAndNullsJSONReplacer);
        return urlVars;
    }

    private addLevelEndEventProperties(eventProps: any, numericArray: any[], textArray: any[]): any {
        for (let i: number = 0, numLength: number = numericArray.length; i < numLength; i++) {
            const key: string = "cD" + (i + 1);
            eventProps[key] = numericArray[i];
        }
        for (let j: number = 0, textLength: number = textArray.length; j < length; j++) {
            const key_j: string = "cT" + (j + 1);
            eventProps[key_j] = textArray[j];
        }
        return eventProps;
    }
}