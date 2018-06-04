class SLTConfig {

    static readonly ACTION_GET_APP_DATA: string = "getAppData";
    static readonly ACTION_ADD_PROPERTIES: string = "addProperties";
    static readonly ACTION_DEV_SYNC_DATA: string = "sync";
    static readonly ACTION_DEV_REGISTER_DEVICE: string = "registerDevice";
    static readonly ACTION_DEV_REGISTER_USER: string = "registerUser";
    static readonly ACTION_HEARTBEAT: string = "heartbeat";
    static readonly ACTION_LEVEL_REPORT: string = "levelReport";

    static readonly SALTR_API_URL: string = "https://api.saltr.com/call";
    static readonly SALTR_DEVAPI_URL: string = "https://devapi.saltr.com/call";

    //used to
    static readonly DEFAULT_CONTENT_ROOT: string = "saltr";
    static readonly DEFAULT_GAME_LEVELS_FEATURE_TOKEN: string = "GAME_LEVELS";
    static readonly CACHE_VERSIONED_CONTENT_ROOT_URL_TEMPLATE: string = SLTConfig.DEFAULT_CONTENT_ROOT + "/app_{0}";
    static readonly CACHE_VERSIONED_APP_DATA_URL_TEMPLATE: string = SLTConfig.DEFAULT_CONTENT_ROOT + "/app_{0}/app_data_cache.json";
    static readonly CACHE_VERSIONED_LEVEL_VERSIONS_URL_TEMPLATE: string = SLTConfig.DEFAULT_CONTENT_ROOT + "/app_{0}/features/{1}/level_versions.json";
    static readonly CACHE_VERSIONED_LEVEL_URL_TEMPLATE: string = SLTConfig.DEFAULT_CONTENT_ROOT + "/app_{0}/features/{1}/level_{2}.json";

    static readonly LOCAL_LEVEL_DATA_URL_TEMPLATE: string = "{0}/features/{1}/level_data.json";
    static readonly LOCAL_LEVEL_CONTENT_URL_TEMPLATE: string = "{0}/{1}";
    static readonly LOCAL_APP_DATA_URL_TEMPLATE: string = SLTConfig.DEFAULT_CONTENT_ROOT + "/app_data.json";

    static readonly RESULT_SUCCEED: string = "SUCCEED";
    static readonly RESULT_ERROR: string = "FAILED";

    static readonly DEVICE_TYPE_IPAD: string = "ipad";
    static readonly DEVICE_TYPE_IPHONE: string = "iphone";
    static readonly DEVICE_TYPE_IPOD: string = "ipod";
    static readonly DEVICE_TYPE_ANDROID: string = "android";
    static readonly DEVICE_PLATFORM_ANDROID: string = "android";
    static readonly DEVICE_PLATFORM_IOS: string = "ios";

    static readonly HEARTBEAT_TIMER_DELAY: number = 30000;

    static readonly FEATURE_TYPE_GENERIC: string = "generic";
    static readonly FEATURE_TYPE_GAME_LEVELS: string = "gameLevels";
    static readonly FEATURE_TYPE_LEVEL_COLLECTION: string = "levelCollection";

}

export {SLTConfig}