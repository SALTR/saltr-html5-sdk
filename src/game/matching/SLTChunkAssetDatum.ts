import {SLTAsset} from "../SLTAsset";
import {Dictionary} from "../../Dictionary";

export class SLTChunkAssetDatum {
    private readonly _assetId:string;
    private readonly _assetToken:string;
    private readonly _stateId:string;


    constructor(assetId:string, stateId:string, assetMap:Dictionary<SLTAsset>) {
        this._assetId = assetId;
        this._assetToken = this.getAssetTokenById(assetMap);
        this._stateId = stateId;
    }

    get assetId(): string {
        return this._assetId;
    }

    get assetToken(): string {
        return this._assetToken;
    }

    get stateId(): string {
        return this._stateId;
    }

    private getAssetTokenById(assetMap:Dictionary<SLTAsset>):string {
        const asset:SLTAsset = assetMap[this._assetId];
        return asset.token;
    }
}