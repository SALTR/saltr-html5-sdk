import {SLT2DAssetInstance} from "./SLT2DAssetInstance";
import {SLT2DBoardLayer} from "./SLT2DBoardLayer";
import {SLT2DBoardConfig} from "./SLT2DBoardConfig";
import {Dictionary} from "../../Dictionary";
import {SLTAsset} from "../SLTAsset";
import {Point} from "./Point";
import {SLTCanvasPlaceHolder} from "./SLTCanvasPlaceHolder";

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
            const scaleX:number = assetInstanceNode.hasOwnProperty("scaleX") ? assetInstanceNode.scaleX : 1.0;
            const scaleY:number = assetInstanceNode.hasOwnProperty("scaleY") ? assetInstanceNode.scaleY : 1.0;
            const rotation:number = assetInstanceNode.rotation;
            const asset:SLTAsset = assetMap[assetInstanceNode.assetId] as SLTAsset;
            const stateId:string = assetInstanceNode.stateId;
            const positions:any[] = this.getAssetInstancePositions(assetInstanceNode);
            assetInstances.push(new SLT2DAssetInstance(asset.token, asset.getInstanceState(stateId), asset.properties, x, y, scaleX, scaleY, rotation, positions));
        }
        return assetInstances;
    }

    private getAssetInstancePositions(assetInstanceNode:any):any[] {
        const positionsArray:any[] = assetInstanceNode.hasOwnProperty("altPositions") ? assetInstanceNode.altPositions  : [];
        return positionsArray.map(positionObject => new SLTCanvasPlaceHolder(positionObject.x, positionObject.y, positionObject.tags));
    }
}