import {SLTAsset} from "../SLTAsset";
import {Dictionary} from "../../Dictionary";
import {SLTAssetInstance} from "../SLTAssetInstance";
import {SLTCompositeInstance} from "./SLTCompositeInstance";

export class SLTCompositeAsset extends SLTAsset {
    private readonly _cellInfos: any[];

    constructor(token:string, cellInfos:any[], stateNodesMap:Dictionary<any>, properties:any) {
        super(token, stateNodesMap, properties);
        this._cellInfos = cellInfos;
    }

    get cellInfos(): any[] {
        return this._cellInfos;
    }

    getInstance(stateId:string):SLTAssetInstance {
        return new SLTCompositeInstance(this._token, this.getInstanceState(stateId), this.properties, this._cellInfos);
    }
}