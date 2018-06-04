import {SLTLevel} from "./game/SLTLevel";
import {SLTConfig} from "./SLTConfig";
import {SLTExperiment} from "./SLTExperiment";
import {SLTFeature} from "./SLTFeature";
import {SLTUtils} from "./utils/SLTUtils";
import {SLTDeserializer} from "./SLTDeserializer";
import {SLTLevelData} from "./SLTLevelData";
import {Dictionary} from "./Dictionary";


class SLTAppData {
    private _activeFeatures: Dictionary<SLTFeature>;
    private readonly _defaultFeatures: Dictionary<SLTFeature>;
    private _gameLevelsFeatures: Dictionary<SLTFeature>;
    private readonly _defaultGameLevelsFeatures: Dictionary<SLTFeature>;
    private _experiments: SLTExperiment[];


    constructor() {
        this._activeFeatures = {};
        this._defaultFeatures = {};
        this._gameLevelsFeatures = {};
        this._defaultGameLevelsFeatures = {};
        this._experiments = [];
    }

    get defaultFeatures(): Dictionary<any> {
        return this._defaultFeatures;
    }

    get gameLevelsFeatures(): Dictionary<any> {
        return this._gameLevelsFeatures;
    }

    get experiments(): SLTExperiment[] {
        return this._experiments;
    }

    getActiveFeatureTokens(): string[] {
        const tokens: string[] = [];
        for (let key in this._activeFeatures) {
            tokens.push(this._activeFeatures[key].token);
        }
        return tokens;
    }

    getFeatureProperties(token: string): any {
        let activeFeature: SLTFeature = this._activeFeatures[token];
        if (activeFeature != null) {
            return activeFeature.properties;
        } else {
            let devFeature: SLTFeature = this._defaultFeatures[token];
            if (devFeature != null && devFeature.required) {
                return devFeature.properties;
            }
        }
        return null;
    }

    getGameLevelsProperties(token: string): SLTLevelData {
        const gameLevelsFeature: SLTFeature = this._gameLevelsFeatures[token];
        if (null != gameLevelsFeature) {
            return gameLevelsFeature.properties as SLTLevelData;
        } else {
            const defaultGameLevelFeature: SLTFeature = this._defaultGameLevelsFeatures[token];
            if (defaultGameLevelFeature != null) {
                return defaultGameLevelFeature.properties as SLTLevelData;
            }
        }
        return null;
    }


    defineFeature(token: string, properties: any, type: string, required: boolean): void {
        if (!SLTUtils.validateFeatureToken(token)) {
            throw new Error("feature's token value is incorrect.");
        }

        const feature: SLTFeature = new SLTFeature(token, type, properties, required);
        if (type == SLTConfig.FEATURE_TYPE_GENERIC) {
            this._defaultFeatures[token] = feature;
        }
        else if (type == SLTConfig.FEATURE_TYPE_GAME_LEVELS) {
            this._defaultGameLevelsFeatures[token] = feature;
        }
    }

    initEmpty(): void {
        for (const i in this._defaultFeatures) {
            this._activeFeatures[i] = this._defaultFeatures[i];
        }
        for (let i in this._defaultGameLevelsFeatures) {
            this._gameLevelsFeatures[i] =  this._defaultGameLevelsFeatures[i];
        }
    }

    initWithData(data: any):
        void {
        try {
            this._gameLevelsFeatures = SLTDeserializer.decodeFeatures(data, SLTConfig.FEATURE_TYPE_GAME_LEVELS);
            this._activeFeatures = SLTDeserializer.decodeFeatures(data, SLTConfig.FEATURE_TYPE_GENERIC);
            this._experiments = SLTDeserializer.decodeExperiments(data);
        } catch (e) {
            throw new Error("AppData parse error");
        }
    }
}

export {SLTAppData}