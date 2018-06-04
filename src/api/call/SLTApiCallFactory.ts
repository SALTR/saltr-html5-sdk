import {SLTAppData} from "../../SLTAppData";
import {SLTApiCall} from "./SLTApiCall";
import {SLTAddPropertiesApiCall} from "./SLTAddPropertiesApiCall";
import {SLTWebAppDataApiCall} from "./SLTWebAppDataApiCall";
import {SLTHeartbeatApiCall} from "./SLTHeartbeatApiCall";
import {SLTLevelContentApiCall} from "./SLTLevelContentApiCall";
import {SLTSendLevelEndEventApiCall} from "./SLTSendLevelEndEventApiCall";
import {SLTLevelReportApiCall} from "./SLTLevelReportApiCall";


class SLTApiCallFactory {
    public static readonly API_CALL_ADD_PROPERTIES: string = "AddProperties";
    public static readonly API_CALL_APP_DATA: string = "AppData";
    public static readonly API_CALL_HEARTBEAT: string = "Heartbeat";
    public static readonly API_CALL_LEVEL_REPORT: string = "LevelReport";
    public static readonly API_CALL_LEVEL_CONTENT: string = "LevelContent";
    public static readonly API_CALL_SEND_LEVEL_END: string = "SendLevelEnd";

    static getCall(name: string, appData: SLTAppData = null): SLTApiCall {
        switch (name) {
            case SLTApiCallFactory.API_CALL_ADD_PROPERTIES:
                return new SLTAddPropertiesApiCall();
            case SLTApiCallFactory.API_CALL_APP_DATA:
                return new SLTWebAppDataApiCall(appData);
            case SLTApiCallFactory.API_CALL_HEARTBEAT:
                return new SLTHeartbeatApiCall();
            case SLTApiCallFactory.API_CALL_LEVEL_CONTENT:
                return new SLTLevelContentApiCall();
            case SLTApiCallFactory.API_CALL_SEND_LEVEL_END:
                return new SLTSendLevelEndEventApiCall();
            case SLTApiCallFactory.API_CALL_LEVEL_REPORT:
                return new SLTLevelReportApiCall();
            default:
                throw new Error('Unknown call API name.');
        }
    }
}

export {SLTApiCallFactory}