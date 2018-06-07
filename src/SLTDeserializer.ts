import {SLTExperiment} from "./SLTExperiment";
import {SLTFeature} from "./SLTFeature";
import {Dictionary} from "./Dictionary";
import {SLTLevel} from "./game/SLTLevel";
import {SLTFeatureType} from "./SLTFeatureType";
import {SLTLevelCollectionBody} from "./SLTLevelCollectionBody";


class SLTDeserializer {

    private static sortByIndex(p1: any, p2: any): number {
        return p1.index - p2.index;
    }

    static decodeExperiments(rootNode: any): SLTExperiment[] {
        const experiments: SLTExperiment[] = [];
        const experimentNodes: any[] = rootNode.experiments;
        if (experimentNodes != null) {
            for (let i: number = 0; i < experimentNodes.length; ++i) {
                const experimentNode: any = experimentNodes[i];
                const token: string = experimentNode.token;
                const partition: string = experimentNode.partition;
                const experimentType: string = experimentNode.type;
                const customEvents: any[] = experimentNode.customEventList as any[];
                experiments.push(new SLTExperiment(token, partition, experimentType, customEvents));
            }
        }
        return experiments;
    }

    static decodeAndUpdateExistingLevels(rootNode: any, existingLevels: SLTLevel[]): SLTLevel[] {
        const levelsNode: any[] = rootNode.levels as any[];
        for (let i: number = 0, length: number = Math.min(existingLevels.length, levelsNode.length); i < length; ++i) {
            const levelNode: any = levelsNode[i];
            const currentSLTLevel: SLTLevel = existingLevels[levelNode.globalIndex];
            currentSLTLevel.update(levelNode.version, levelNode.url);
        }
        return existingLevels;
    }

    static decodeAndCreateNewLevels(rootNode: any): SLTLevel[] {
        const levelsNode: any[] = rootNode.levels;
        const levels: SLTLevel[] = [];
        for (let i: number = 0, length: number = levelsNode.length; i < length; ++i) {
            const levelNode: any = levelsNode[i];
            const level: SLTLevel = new SLTLevel(levelNode.globalIndex, levelNode.localIndex, levelNode.packIndex, levelNode.url, levelNode.levelToken, levelNode.packToken, levelNode.version);
            levels.push(level);
        }
        return levels;
    }

    static decodeAndInitFeatures(snapshotAppdataNode: any, features: Dictionary<any>): Dictionary<any> {
        const featureNodes: any[] = snapshotAppdataNode.features as any[];
        if (featureNodes != null) {
            for (let i: number = 0, len: number = featureNodes.length; i < len; ++i) {
                const featureNode: any = featureNodes[i];
                const token: string = featureNode.token;
                const featureType: string = featureNode.type;
                const version: string = featureNode.version;
                const isRequired: boolean = featureNode.required;

                const parsedBody: any = JSON.parse(featureNode.properties);

                switch (featureType) {
                    case SLTFeatureType.GENERIC :
                        features[token] = new SLTFeature(token, featureType, version, parsedBody, isRequired);
                        break;

                    case SLTFeatureType.LEVEL_COLLECTION :
                        features[token] = new SLTFeature(token, featureType, version, new SLTLevelCollectionBody(parsedBody), isRequired);
                        break;

                    default:
                        console.log("SALTR parsing unknown feature type.");
                }
            }
        }
        return features;
    }


    static decodeAndUpdateFeatures(rootNode: any, sltFeatureMap: Dictionary<any>): Dictionary<any> {
        const featureNodes: any[] = rootNode.features as any[];

        if (featureNodes != null) {

            const featureNodeMap: Dictionary<any> = {};
            for (let i: number = 0, len: number = featureNodes.length; i < len; ++i) {
                const node: any = featureNodes[i];
                featureNodeMap[node.token] = node;
            }

            for (const key in sltFeatureMap) {
                const sltFeature: SLTFeature = sltFeatureMap[key];
                const token: string = sltFeature.token;
                const featureType: string = sltFeature.type;
                const featureNode: any = featureNodeMap[token];

                if (featureNode != null) {
                    const featureNodeVersion: string = featureNode.version;
                    sltFeature.disabled = false;
                    if (sltFeature.version != featureNodeVersion) {
                        switch (featureType) {
                            case SLTFeatureType.GENERIC :
                                sltFeature.update(featureNodeVersion, JSON.parse(featureNode.properties));
                                break;

                            case SLTFeatureType.LEVEL_COLLECTION :
                                const body: SLTLevelCollectionBody = sltFeature.body;
                                body.updateLevels(JSON.parse(featureNode.properties));
                                sltFeature.update(featureNodeVersion);
                                break;

                            default:
                                console.log("SALTR parsing unknown feature type.");
                        }
                    }

                } else if (sltFeature.isRequired == false) {
                    sltFeature.disabled = true;
                }


            }
        }
        return sltFeatureMap;
    }
}

export {SLTDeserializer}