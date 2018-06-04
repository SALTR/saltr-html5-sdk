import {SLTExperiment} from "./SLTExperiment";
import {SLTConfig} from "./SLTConfig";
import {SLTFeature} from "./SLTFeature";
import {SLTLevelData} from "./SLTLevelData";
import {Dictionary} from "./Dictionary";
import {SLTLevel} from "./game/SLTLevel";


class SLTDeserializer {

    private static sortByIndex(p1: any, p2: any): number {
        return p1.index - p2.index;
    }

    public static decodeExperiments(rootNode: any): SLTExperiment[] {
        const experimentNodes: any[] = rootNode.experiments;
        return !experimentNodes ? [] : experimentNodes.map(experimentNode => new SLTExperiment(experimentNode.token,
            experimentNode.partition, experimentNode.type, experimentNode.customEventList)
        );
    }

    static decodeLevels(rootNode: any): SLTLevel[] {
        const levels: any[] = rootNode.levels;
        return !levels ? [] : levels.map(level => new SLTLevel(level.globalIndex, level.localIndex, level.packIndex, level.url, level.version));
    }

    public static decodeFeatures(rootNode: any, decodeFeatureType: string, existingFeatures: Dictionary<any> = null): Dictionary<any> {
        let features: Dictionary<any> = {};
        let featureNodes: any[] = rootNode.features;
        if (featureNodes) {
            for (let i: number = 0, len: number = featureNodes.length; i < len; ++i) {
                const featureNode: any = featureNodes[i];
                const token: string = featureNode.token;
                const featureType: string = featureNode.type;
                const properties: any = featureNode.properties;
                const required: boolean = featureNode.required;
                if (SLTConfig.FEATURE_TYPE_GAME_LEVELS == decodeFeatureType && SLTConfig.FEATURE_TYPE_GAME_LEVELS == featureType) {
                    const levelData: SLTLevelData = new SLTLevelData();
                    levelData.initWithData(properties);
                    features[token] = new SLTFeature(token, featureType, levelData, required);
                } else if (SLTConfig.FEATURE_TYPE_GENERIC == decodeFeatureType && SLTConfig.FEATURE_TYPE_GENERIC == featureType) {
                    features[token] = new SLTFeature(token, featureType, properties, required);
                }
            }
        }
        return features;
    }

    public static getFeature(rootNode: any, featureToken: string, featureType: string): any {
        let feature: any = null;
        let featureNodes: any[] = rootNode.features as any[];
        if (featureNodes) {
            for (let i: number = 0, length: number = featureNodes.length; i < length; ++i) {
                let featureNode: any = featureNodes[i];
                if (featureToken == featureNode.token && featureType == featureNode.type) {
                    feature = featureNode;
                    break;
                }
            }
        }
        return feature;
    }

    /*
     Provides cached level version from level_versions.json
     rootNode - level_versions.json
     globalIndex - The level global identifier
     */
    public static getCachedLevelVersion(rootNode: any, globalIndex: number): string {
        let version: string = null;
        let container: any[] = rootNode as any[];
        if (null != container) {
            for (let i: number = 0, length: number = container.length; i < length; ++i) {
                let cachedLevelNode: any = container[i];
                if (globalIndex == cachedLevelNode.globalIndex) {
                    version = cachedLevelNode.version;
                    break;
                }
            }
        }
        return version;
    }
}

export {SLTDeserializer}