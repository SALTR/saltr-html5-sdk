import {SLTBasicProperties} from "./SLTBasicProperties";
import {SLTLevel} from "./game/SLTLevel";
import {SLTLogger} from "./utils/SLTLogger";
import {SLTStatus} from "./status/SLTStatus";
import {SLTConfig} from "./SLTConfig";
import {SLTAppData} from "./SLTAppData";
import {SLTExperiment} from "./SLTExperiment";
import {SLTLevelData} from "./SLTLevelData";
import {SLTApiCallFactory} from "./api/call/SLTApiCallFactory";
import {SLTApiCall} from "./api/call/SLTApiCall";
import {SLTStatusAppDataConcurrentLoadRefused} from "./status/SLTStatusAppDataConcurrentLoadRefused";
import {SLTStatusAppDataLoadFail} from "./status/SLTStatusAppDataLoadFail";
import {Timer} from "./timer/Timer";
import {TimerEvent} from "./timer/TimerEvent";
import {SLTApiCallResult} from "./api/call/SLTApiCallResult";
import {SLTStatusAppDataParseError} from "./status/SLTStatusAppDataParseError";
import {SLTStatusLevelsParseError} from "./status/SLTStatusLevelsParseError";
import {SLTStatusLevelContentLoadFail} from "./status/SLTStatusLevelContentLoadFail";

class SLTSaltr {
    private readonly _socialId: string;
    private _platform: string;
    private _connected:boolean;
    private readonly _clientKey: string;
    private _isLoading: boolean;

    private _connectSuccessCallback: (...args: any[]) => void;
    private _connectFailCallback: (...args: any[]) => void;
    private _levelContentLoadSuccessCallback: (...args: any[]) => void;
    private _levelContentLoadFailCallback: (...args: any[]) => void;

    private _requestIdleTimeout:number;
    private readonly _devMode: boolean;
    private readonly _started: boolean;
    private _isSynced: boolean;
    private readonly _useNoLevels: boolean;
    private _useNoFeatures: boolean;

    private readonly _appData: SLTAppData;
    private readonly _levelData: SLTLevelData;

    private _heartbeatTimer: Timer;
    private  _heartBeatTimerStarted: boolean;

    /**
     * Class constructor.
     * @param clientKey The client key.
     * @param socialId The social identifier.
     */
    constructor(clientKey:string, socialId:string) {
        this._clientKey = clientKey;
        this._socialId = socialId;
        this._isLoading = false;
        this._connected = false;
        this._useNoLevels = false;
        this._useNoFeatures = false;
        this._heartBeatTimerStarted = false;

        this._devMode = false;
        this._started = false;
        this._isSynced = false;
        this._requestIdleTimeout = 0;

        this._appData = new SLTAppData();
        this._levelData = new SLTLevelData();
    }

    public get allLevels():SLTLevel[] {
        return this._levelData.allLevels;
    }

    /**
     * The total levels number.
     */
    public get allLevelsCount():number {
        return this._levelData.allLevelsCount;
    }

    /**
     * The experiments.
     */
    public get experiments():SLTExperiment[] {
        return this._appData.experiments;
    }

    /**
     * Provides the level by provided global index.
     * @param index The global index of the level.
     * @return SLTLevel The level instance specified by index.
     */
    public getLevelByGlobalIndex(index:number):SLTLevel {
        return this._levelData.getLevelByGlobalIndex(index);
    }

    /**
     * Provides active feature tokens.
     */
    public getActiveFeatureTokens():string[] {
        return this._appData.getActiveFeatureTokens();
    }

    /**
     * Provides the feature properties by provided token.
     * @param token The unique identifier of the feature.
     * @return Object The feature's properties.
     */
    public getFeatureProperties(token:string):any {
        return this._appData.getFeatureProperties(token);
    }

    /**
     * Imports level from provided path.
     * @param json The levels information containing JSON.
     */
    public importLevelsFromJSON(json:string):void {
        if (this._useNoLevels) {
            return;
        }

        if (!this._started) {
            const applicationData: any = JSON.parse(json);
            this._levelData.initWithData(applicationData);
        } else {
            throw new Error("Method 'importLevels()' should be called before 'start()' only.");
        }
    }

    /**
     * Define feature.
     * @param token The unique identifier of the feature.
     * @param properties The properties of the feature.
     * @param required The required state of the feature.
     */
    public defineFeature(token:String, properties:Object, required:Boolean = false):void {
//        if (this._useNoFeatures) {
//            return;
//        }
//
//        if (this._started == false) {
//            this._appData.defineFeature(token, properties, required);
//        } else {
//            throw new Error("Method 'defineFeature()' should be called before 'start()' only.");
//        }
    }

    /**
     * Starts the instance.
     */
    public start():void {
//        if (this._socialId == null) {
//            throw new Error("socialId field is required and can't be null.");
//        }
//        if (SLTUtils.getDictionarySize(this._appData.developerFeatures) == 0 && this._useNoFeatures == false) {
//            throw new Error("Features should be defined.");
//        }
//        this._appData.initEmpty();
//        this._started = true;
    }

    /**
     * Establishes the connection to Saltr server.
     */
    public connect(successCallback:(...args: any[]) => void, failCallback:(...args: any[]) => void,
                   basicProperties:any = null, customProperties:any = null):void {
        if (!this._started) {
            throw new Error("Method 'connect()' should be called after 'start()' only.");
        }

        if (this._isLoading) {
            failCallback(new SLTStatusAppDataConcurrentLoadRefused());
            return;
        }

        this._connectSuccessCallback = successCallback;
        this._connectFailCallback = failCallback;

        this._isLoading = true;

        const params: any = {
            clientKey: this._clientKey,
            devMode: this._devMode,
            socialId: this._socialId,
            basicProperties: basicProperties,
            customProperties: customProperties
        };
        const appDataCall: SLTApiCall = SLTApiCallFactory.getCall(SLTApiCallFactory.API_CALL_APP_DATA);
       // appDataCall.call(params, this.appDataApiCallback, this._requestIdleTimeout);
    }

    /**
     * Loads the level content.
     * @param sltLevel The level.
     * @param successCallback The success callback function.
     * @param failCallback The fail callback function.
     */
    public loadLevelContent(sltLevel:SLTLevel, successCallback:(...args: any[]) => void, failCallback:(...args: any[]) => void):void {
        this._levelContentLoadSuccessCallback = successCallback;
        this._levelContentLoadFailCallback = failCallback;
        this.loadLevelContentFromSaltr(sltLevel);
    }

    /**
     * Adds properties.
     * @param basicProperties The basic properties.
     * @param customProperties The custom properties.
     */
    public addProperties(basicProperties:any = null, customProperties:any = null):void {
        if (!basicProperties && !customProperties) {
            return;
        }

        const params: any = {
            clientKey: this._clientKey,
            socialId: this._socialId,
            basicProperties: basicProperties,
            customProperties: customProperties
        };
        const addPropertiesApiCall: SLTApiCall = SLTApiCallFactory.getCall(SLTApiCallFactory.API_CALL_ADD_PROPERTIES);
//        addPropertiesApiCall.call(params, addPropertiesApiCallback, this._requestIdleTimeout);
    }

    /**
     * Opens user registration dialog.
     */
    public registerUser():void {
        if (!this._started) {
            throw new Error("Method 'registerDevice()' should be called after 'start()' only.");
        }
    }

    /**
     * Send "level end" event
     * @param variationId The variation identifier.
     * @param endStatus The end status.
     * @param endReason The end reason.
     * @param score The score.
     * @param customTextProperties The custom text properties.
     * @param customNumbericProperties The numberic properties.
     */
    public sendLevelEndEvent(variationId:string, endStatus:string, endReason:string, score:number,
                             customTextProperties:any[], customNumbericProperties:any[]):void {
        const params: any = {
            clientKey: this._clientKey,
            devMode: this._devMode,
            variationId: variationId,
            socialId: this._socialId,
            endReason: endReason,
            endStatus: endStatus,
            score: score,
            customNumbericProperties: customNumbericProperties,
            customTextProperties: customTextProperties
        };

        const sendLevelEndEventApiCall: SLTApiCall = SLTApiCallFactory.getCall(SLTApiCallFactory.API_CALL_SEND_LEVEL_END);
//        sendLevelEndEventApiCall.call(params, sendLevelEndApiCallback);
    }

    /**
     * Loads the level content.
     * @param sltLevel The level.
     */
    private loadLevelContentFromSaltr(sltLevel:SLTLevel):void {
        var params:any = {
            levelContentUrl: sltLevel.contentUrl + "?this._timethis._=" + new Date().getTime()
        };
        var levelContentApiCall:SLTApiCall = SLTApiCallFactory.getCall(SLTApiCallFactory.API_CALL_LEVEL_CONTENT);
//        levelContentApiCall.call(params, levelContentApiCallback, this._requestIdleTimeout);
        const thisInstance = this;
        function levelContentApiCallback(result:SLTApiCallResult):void {
            const content: any = result.data;
            if (result.success && content != null) {
                thisInstance.levelContentLoadSuccessHandler(sltLevel, content);
            }
            else {
                thisInstance.levelContentLoadFailHandler();
            }
        }
    }

    private levelContentLoadSuccessHandler(sltLevel:SLTLevel, content:any):void {
        sltLevel.updateContent(content);
        this._levelContentLoadSuccessCallback();
    }

    private levelContentLoadFailHandler():void {
        this._levelContentLoadFailCallback(new SLTStatusLevelContentLoadFail());
    }

    private addPropertiesApiCallback(result:SLTApiCallResult):void {
        if (result.success) {
            console.log("[addPropertiesApiCallback] success");
        } else {
            console.log("[addPropertiesApiCallback] error");
        }
    }

    private appDataApiCallback(result:SLTApiCallResult):void {
        if (result.success) {
            this.appDataLoadSuccessCallback(result);
        } else {
            this.appDataLoadFailCallback(result.status);
        }
    }

    //TODO @GSAR: later we need to report the feature set differences by an event or a callback to client;
    private appDataLoadSuccessCallback(result:SLTApiCallResult):void {
        this._isLoading = false;

        if (this._devMode && !this._isSynced) {
            this.sync();
        }

        const levelType: String = result.data.levelType;

        try {
            this._appData.initWithData(result.data);
        } catch (e) {
            this._connectFailCallback(new SLTStatusAppDataParseError());
            return;
        }

        if (!this._useNoLevels && levelType != SLTLevel.LEVEL_TYPE_NONE) {
            try {
                this._levelData.initWithData(result.data);
            } catch (e) {
                this._connectFailCallback(new SLTStatusLevelsParseError());
                return;
            }

        }

        this._connected = true;
        this._connectSuccessCallback();

        if (!this._heartBeatTimerStarted) {
            this.startHeartbeat();
        }
    }

    private appDataLoadFailCallback(status:SLTStatus):void {
        this._isLoading = false;
        if (status.statusCode == 'API_ERROR') {
            this._connectFailCallback(new SLTStatusAppDataLoadFail());
        } else {
            this._connectFailCallback(status);
        }
    }

    private addUserSuccessHandler():void {
        console.log("[Saltr] Dev adding new user has succeed.");
        this.sync();
    }

    private addUserFailHandler(result:SLTApiCallResult):void {
        console.log("[Saltr] Dev adding new user has failed.");
    }

    private addUserToSALTR(email:string):void {
        const params: any = {
            email: email,
            clientKey: this._clientKey,
            socialId: this._socialId,
            platform: this._platform,
            devMode: this._devMode
        };
    }

    private registerUserApiCallback(result:SLTApiCallResult):void {
        if (result.success) {
            this.addUserSuccessHandler();
        } else {
            this.addUserFailHandler(result);
        }
    }

    private sendLevelEndApiCallback(result:SLTApiCallResult):void {
        if (result.success) {
            console.log("sendLevelEndSuccessHandler");
        } else {
            console.log("sendLevelEndFailHandler");
        }
    }

    private sync():void {
//        var params:Object = {
//            clientKey: this._clientKey,
//            devMode: this._devMode,
//            socialId: this._socialId,
//            developerFeatures: this._appData.developerFeatures
//        };
//        var syncApiCall:SLTApiCall = this._apiFactory.getCall(SLTApiCallFactory.APIthis._CALLthis._SYNC, false);
//        syncApiCall.call(params, syncApiCallback);
    }

    private syncApiCallback(result:SLTApiCallResult):void {
        if (result.success) {
            this.syncSuccessHandler();
        } else {
            this.syncFailHandler(result);
        }
    }

    private syncSuccessHandler():void {
        this._isSynced = true;
    }

    private syncFailHandler(result:SLTApiCallResult):void {
        if (result.status.statusCode == 'REGISTRATION_REQUIRED') {
            this.registerUser();
        }
        else {
            console.log("[Saltr] Dev feature Sync has failed. " + result.status.statusMessage);
        }
    }

    private startHeartbeat():void {
        this.stopHeartbeat();
        this._heartbeatTimer = new Timer(SLTConfig.HEARTBEAT_TIMER_DELAY);
        this._heartbeatTimer.addEventListener(TimerEvent.TIMER, this.heartbeatTimerHandler);
        this._heartbeatTimer.start();
        this._heartBeatTimerStarted = true;
    }

    private stopHeartbeat():void {
        if (null != this._heartbeatTimer) {
            this._heartbeatTimer.stop();
            this._heartbeatTimer.removeEventListener(TimerEvent.TIMER, this.heartbeatTimerHandler);
            this._heartbeatTimer = null;
        }
        this._heartBeatTimerStarted = false;
    }

    private heartbeatTimerHandler(event:TimerEvent):void {
        const params: any = {
            clientKey: this._clientKey,
            devMode: this._devMode,
            socialId: this._socialId
        };
        const heartbeatApiCall: SLTApiCall = SLTApiCallFactory.getCall(SLTApiCallFactory.API_CALL_HEARTBEAT);
//        heartbeatApiCall.call(params, heartbeatApiCallback);
    }

    private heartbeatApiCallback(result:SLTApiCallResult):void {
        if (!result.success) {
            this.stopHeartbeat();
        }
    }
}

export {SLTSaltr}