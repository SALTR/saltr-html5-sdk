import {SLTBasicProperties} from "./SLTBasicProperties";
import {SLTLevel} from "./game/SLTLevel";
import {SLTLogger} from "./utils/SLTLogger";
import {SLTStatus} from "./status/SLTStatus";
import {SLTConfig} from "./SLTConfig";
import {SLTAppData} from "./SLTAppData";
import {SLTExperiment} from "./SLTExperiment";
import {SLTApiCallFactory} from "./api/call/SLTApiCallFactory";
import {SLTApiCall} from "./api/call/SLTApiCall";
import {SLTStatusAppDataConcurrentLoadRefused} from "./status/SLTStatusAppDataConcurrentLoadRefused";
import {SLTStatusAppDataLoadFail} from "./status/SLTStatusAppDataLoadFail";
import {Timer} from "./timer/Timer";
import {TimerEvent} from "./timer/TimerEvent";
import {SLTLevelCollectionBody} from "./SLTLevelCollectionBody";
import {SLTContext} from "./SLTContext";

class SLTSaltr {
    private _socialId: string;
    private readonly _clientKey: string;
    private _isWaitingForAppData: boolean;

    private _basicProperties: SLTBasicProperties;
    private _customProperties: any;
    private _logger: SLTLogger;

    private _nativeTimeout: number;
    private _dropTimeout: number;
    private _timeoutIncrease: number;
    private _devMode: boolean;

    private _appData: SLTAppData;

    private _heartbeatTimer: Timer;
    private _heartBeatTimerStarted: boolean;
    private _sltLevel: SLTLevel;
    private _callback: (...args: any[]) => void;

    private _connectSuccessCallback: (...args: any[]) => void;
    private _connectFailCallback: (...args: any[]) => void;

    /**
     * Class constructor.
     * @param clientKey The client key.
     * @param socialId The social identifier.
     */
    constructor(clientKey: string, socialId: string = null) {
        this._clientKey = clientKey;
        this._socialId = socialId;

        this._heartBeatTimerStarted = false;
        this._devMode = false;
        this._nativeTimeout = 0;
        this._dropTimeout = 0;
        this._timeoutIncrease = 0;
        this._logger = SLTLogger.getInstance();
        this._appData = new SLTAppData();

        this.appDataConnectSuccessHandler = this.appDataConnectSuccessHandler.bind(this);
        this.appDataConnectFailHandler = this.appDataConnectFailHandler.bind(this);
        this.heartbeatTimerHandler = this.heartbeatTimerHandler.bind(this);
    }


    /**
     * The dev mode state.
     */
    set devMode(value: boolean) {
        this._devMode = value;
        this._logger.debug = this._devMode;
    }

    /**
     * The verbose logging state.
     * Note: This works only in development mode
     */
    set verboseLogging(value: boolean) {
        this._logger.verboseLogging = value;
    }

    /**
     * The request idle timeout. Works on mobile platform only. For Web version dropTimeout should be used.
     */
    set nativeTimeout(value: number) {
        this._nativeTimeout = value;
    }

    /**
     * The request drop timeout.
     */
    set dropTimeout(value: number) {
        this._dropTimeout = value;
    }

    /**
     * The request progressive timeout.
     */
    set timeoutIncrease(value: number) {
        this._timeoutIncrease = value;
    }

    /**
     * The experiments.
     */
    get experiments(): SLTExperiment[] {
        return this._appData.experiments;
    }

    /**
     * The social identifier.
     */
    set socialId(socialId: string) {
        this._socialId = socialId;
    }

    /**
     * Provides the feature properties by provided token.
     * @param token The unique identifier of the feature.
     * @return any The feature's properties.
     */
    getFeatureBody(token: string): any {
        return this._appData.getFeatureBody(token);
    }

    /**
     * Provides the game level feature properties by provided token.
     * @param token The unique identifier of the feature
     * @return SLTLevelCollectionBody The level data object.
     */
    getLevelCollectionFeatureBody(token: string): SLTLevelCollectionBody {
        return this._appData.getLevelCollectionBody(token);
    }

    private canGetAppData(): boolean {
        return !this._isWaitingForAppData;
    }

    initLevelContent(levelCollectionToken: string, sltLevel: SLTLevel, callback: (...args: any[]) => void): void {
        sltLevel.contentReady = false;
        this.initLevelContentFromSaltr(levelCollectionToken, sltLevel, callback);
    }

    clearLevelContent(sltLevel: SLTLevel): void {
        sltLevel.clearContent();
    }

    private initLevelContentFromSaltr(levelCollectionToken: string, sltLevel: SLTLevel, callback: (...args: any[]) => void): void {
        const params: any = {
            contentUrl: sltLevel.contentUrl,
            alternateUrl: sltLevel.defaultContentUrl
        };

        const levelContentApiCall: SLTApiCall = SLTApiCallFactory.getCall(SLTApiCallFactory.API_CALL_LEVEL_CONTENT);
        levelContentApiCall.call(params, this.levelContentLoadSuccessCallback.bind(this), this.levelContentLoadFailCallback.bind(this), this._dropTimeout);
    }

    levelContentLoadSuccessCallback(data: any): void {
        this._sltLevel.updateContent(data);
        this._callback(true);
    }

    levelContentLoadFailCallback(status: SLTStatus): void {
        this._callback(false);
    }

    sendLevelReport(successCallback: (...args: any[]) => void, failCallback: (...args: any[]) => void, properties: any): void {
        const params: any = {
            clientKey: this._clientKey,
            socialId: this._socialId,
            levelReportEventProperties: properties
        };

        const levelReportApiCall: SLTApiCall = SLTApiCallFactory.getCall(SLTApiCallFactory.API_CALL_LEVEL_REPORT);
        levelReportApiCall.call(params, successCallback, failCallback, this._dropTimeout);
    }

    /**
     * Establishes the connection to Saltr server.
     */
    connect(successCallback: (...args: any[]) => void, failCallback: (...args: any[]) => void, basicProperties: SLTBasicProperties, customProperties: any = null): void {
        SLTLogger.getInstance().log("Method 'connect()' called.");
        if (this.canGetAppData()) {
            this._connectSuccessCallback = successCallback;
            this._connectFailCallback = failCallback;
            this._customProperties = customProperties;
            this._basicProperties = basicProperties;
            this.getAppData(this.appDataConnectSuccessHandler, this.appDataConnectFailHandler, false, this._basicProperties, this._customProperties);
        } else {
            SLTLogger.getInstance().log("Connect failed. Concurrent load accrues.");
            failCallback(new SLTStatusAppDataConcurrentLoadRefused());
        }
    }

    /**
     * Adds properties.
     * @param basicProperties The basic properties.
     * @param customProperties The custom properties.
     */
    addProperties(basicProperties: any = null, customProperties: any = null): void {
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
        addPropertiesApiCall.call(params, this.addPropertiesSuccessHandler, this.addPropertiesFailHandler, this._dropTimeout);
    }

    private addPropertiesSuccessHandler(data: any): void {
        console.log("[SALTR] addPropertiesApiCallback() - succeeded.");
    }

    private addPropertiesFailHandler(status: SLTStatus): void {
        console.log("[SALTR] addPropertiesApiCallback() - failed.");
    }

    private sendLevelEndSuccessHandler(data: any): void {
        console.log("[SALTR] sendLevelEndSuccessHandler() - succeeded.");
    }

    private sendLevelEndFailHandler(status: SLTStatus): void {
        console.log("[SALTR] sendLevelEndFailHandler() - failed.");
    }

    /**
     * Send "level end" event
     * @param constiationId The constiation identifier.
     * @param endStatus The end status.
     * @param endReason The end reason.
     * @param score The score.
     * @param customTextProperties The custom text properties.
     * @param customNumbericProperties The numberic properties.
     */
    sendLevelEndEvent(constiationId: string, endStatus: string, endReason: string, score: number, customTextProperties: any[], customNumbericProperties: any[]): void {
        const params: any = {
            clientKey: this._clientKey,
            devMode: this._devMode,
            constiationId: constiationId,
            socialId: this._socialId,
            endReason: endReason,
            endStatus: endStatus,
            score: score,
            customNumbericProperties: customNumbericProperties,
            customTextProperties: customTextProperties
        };

        const sendLevelEndEventApiCall: SLTApiCall = SLTApiCallFactory.getCall(SLTApiCallFactory.API_CALL_SEND_LEVEL_END);
        sendLevelEndEventApiCall.call(params, this.sendLevelEndSuccessHandler, this.sendLevelEndFailHandler);
    }

    private startHeartbeat(): void {
        this.stopHeartbeat();
        this._heartbeatTimer = new Timer(SLTConfig.HEARTBEAT_TIMER_DELAY);
        this._heartbeatTimer.addEventListener(TimerEvent.TIMER, this.heartbeatTimerHandler);
        this._heartbeatTimer.start();
        this._heartBeatTimerStarted = true;
    }

    private stopHeartbeat(): void {
        if (null != this._heartbeatTimer) {
            this._heartbeatTimer.stop();
            this._heartbeatTimer.removeEventListener(TimerEvent.TIMER, this.heartbeatTimerHandler);
            this._heartbeatTimer = null;
        }
        this._heartBeatTimerStarted = false;
    }

    private heartbeatTimerHandler(event: TimerEvent): void {
        const params: any = {
            clientKey: this._clientKey,
            devMode: this._devMode,
            socialId: this._socialId
        };
        const heartbeatApiCall: SLTApiCall = SLTApiCallFactory.getCall(SLTApiCallFactory.API_CALL_HEARTBEAT);

        heartbeatApiCall.call(params, null, this.heartbeatFailHandler);
    }

    private heartbeatFailHandler(status: SLTStatus): void {
        this.stopHeartbeat();
    }

    private getAppData(successHandler: (...args: any[]) => void, failHandler: (...args: any[]) => void, ping: boolean = false, basicProperties: any = null, customProperties: any = null, additionalParams: any = null): void {
        this._isWaitingForAppData = true;

        const params: any = {
            context: SLTContext.NORMAL,
            clientKey: this._clientKey,
            devMode: this._devMode,
            ping: ping,
            socialId: this._socialId,
            basicProperties: basicProperties,
            customProperties: customProperties,
        };

        if (additionalParams != null) {
            for (const i in additionalParams) {
                params[i] = additionalParams[i];
            }
        }

        const appDataCall: SLTApiCall = SLTApiCallFactory.getCall(SLTApiCallFactory.API_CALL_APP_DATA, this._appData);
        appDataCall.call(params, successHandler, failHandler, this._dropTimeout);
        SLTLogger.getInstance().log("New app data requested.");
    }

    /**
     * Sends Ping GetAppData call to Saltr.
     */
    ping(successCallback: (...args: any[]) => void = null, failCallback: (...args: any[]) => void = null): void {
        if (this.canGetAppData()) {
            this._connectSuccessCallback = successCallback;
            this._connectFailCallback = failCallback;
            this.getAppData(this.appDataConnectSuccessHandler, this.appDataConnectFailHandler, true, this._basicProperties, this._customProperties);
        }
    }

    private appDataConnectSuccessHandler(data: SLTAppData): void {
        this._appData = data;
        this._isWaitingForAppData = false;
        this._connectSuccessCallback();

        if (!this._heartBeatTimerStarted) {
            this.startHeartbeat();
        }
    }

    private appDataConnectFailHandler(status: SLTStatus): void {
        SLTLogger.getInstance().log("New app data request from connect() failed. StatusCode: " + status.statusCode);
        this._isWaitingForAppData = false;

        if ('API_ERROR' == status.statusCode) {
            this._connectFailCallback(new SLTStatusAppDataLoadFail());
        } else {
            this._connectFailCallback(status);
        }
    }
}

export {SLTSaltr}