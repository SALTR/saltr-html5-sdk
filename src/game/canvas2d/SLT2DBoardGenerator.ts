import {SLT2DAssetInstance} from "./SLT2DAssetInstance";
import {SLT2DBoardLayer} from "./SLT2DBoardLayer";
import {SLT2DBoardConfig} from "./SLT2DBoardConfig";
import {Dictionary} from "../../Dictionary";
import {SLTAsset} from "../SLTAsset";
import {Point} from "./Point";

export class SLT2DBoardGenerator {
    public generate(boardConfig:SLT2DBoardConfig, layer:SLT2DBoardLayer, assetInstancesByLayerId:Dictionary<any>,
                    assetInstancesByLayerIndex:Dictionary<any>):void {
        const assetInstances:SLT2DAssetInstance[] = this.parseAssetInstances(layer, boardConfig.assetMap);
        assetInstancesByLayerId[layer.token] = assetInstances;
        assetInstancesByLayerIndex[layer.index] = assetInstances;
    }

    private parseAssetInstances(layer:SLT2DBoardLayer, assetMap:Dictionary<any>):SLT2DAssetInstance[] {
        const assetInstances:SLT2DAssetInstance[] = [];
        const assetNodes:any[] = layer.assetRules;
        for (let i:number = 0, len:number = assetNodes.length; i < len; ++i) {
            const assetInstanceNode:any = assetNodes[i];
            const x:number = assetInstanceNode.x;
            const y:number = assetInstanceNode.y;
            const scaleX:number = assetInstanceNode.hasOwnProperty("scaleX") ? assetInstanceNode.scaleX : 1;
            const scaleY:number = assetInstanceNode.hasOwnProperty("scaleY") ? assetInstanceNode.scaleY : 1;
            const rotation:number = assetInstanceNode.rotation;
            const asset:SLTAsset = assetMap[assetInstanceNode.assetId] as SLTAsset;
            const stateId:string = assetInstanceNode.stateId;
            const positions:Dictionary<any> = this.getAssetInstancePositions(assetInstanceNode);
            assetInstances.push(new SLT2DAssetInstance(asset.token, asset.getInstanceState(stateId), asset.properties, x, y, scaleX, scaleY, rotation, positions));
        }
        return assetInstances;
    }

    private getAssetInstancePositions(assetInstanceNode:any):Dictionary<any> {
        const positions:Dictionary<any> = {};
        const positionsArray:any[] = assetInstanceNode.hasOwnProperty("positions") ? assetInstanceNode.positions  : [];
        const positionsCount:number = positionsArray.length;
        for (let i:number = 0; i < positionsCount; ++i) {
            const positionObject:any = positionsArray[i];
            const positionId:string = positionObject.id;
            positions[positionId] = new Point(positionObject.x, positionObject.y);
        }
        return positions;
    }
}