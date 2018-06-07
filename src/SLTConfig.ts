class SLTConfig {

    static readonly ACTION_GET_APP_DATA:string = "getAppData";
    static readonly ACTION_ADD_PROPERTIES:string = "addProperties";
    static readonly ACTION_DEV_ADD_LEVELEND_EVENT:string = "addLevelEndEvent";
    static readonly ACTION_HEARTBEAT:string = "heartbeat";
    static readonly ACTION_LEVEL_REPORT:string = "levelReport";

    static readonly SALTR_API_URL:string = "https://api.saltr.com/call";
    static readonly SALTR_DEVAPI_URL:string = "https://devapi.saltr.com/call";
    static readonly HEARTBEAT_TIMER_DELAY:number = 120000.0;

}

export {SLTConfig}