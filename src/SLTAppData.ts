import {SLTExperiment} from "./SLTExperiment";
import {SLTFeature} from "./SLTFeature";
import {SLTDeserializer} from "./SLTDeserializer";
import {Dictionary} from "./Dictionary";
import {SLTLevelCollectionBody} from "./SLTLevelCollectionBody";


class SLTAppData {
    private _activeFeatures: Dictionary<SLTFeature>;
    private _experiments: SLTExperiment[];
    private _snapshotId: string;


    constructor() {
        this._activeFeatures = {};
        this._experiments = [];
    }

    get experiments(): SLTExperiment[] {
        return this._experiments;
    }

    get activeFeatures(): Dictionary<SLTFeature> {
        return this._activeFeatures;
    }

    get snapshotId(): string {
        return this._snapshotId;
    }

    getFeatureBody(token: string): any {
        const activeFeature: SLTFeature = this._activeFeatures[token];
        return activeFeature && !activeFeature.disabled ? activeFeature.body : null;
    }

    getLevelCollectionBody(token: string): SLTLevelCollectionBody {
        const levelCollectionFeature: SLTFeature = this._activeFeatures[token];
        if (levelCollectionFeature != null) {
            return levelCollectionFeature.body as SLTLevelCollectionBody;
        }
        return null;
    }


    defineFeature(token: string, body: any, type: string, required: boolean): void {
        this._activeFeatures[token] = new SLTFeature(token, type, body, required);
    }

    initWithData(data: any): void {
        this._activeFeatures = SLTDeserializer.decodeAndUpdateFeatures(data, this._activeFeatures);
        this._experiments = SLTDeserializer.decodeExperiments(data);
    }
}

export {SLTAppData}