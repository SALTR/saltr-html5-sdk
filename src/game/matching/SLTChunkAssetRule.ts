export class SLTChunkAssetRule {
    static ASSET_DISTRIBUTION_TYPE_COUNT: string = "count";
    static ASSET_DISTRIBUTION_TYPE_RATIO: string = "ratio";
    static ASSET_DISTRIBUTION_TYPE_RANDOM: string = "random";

    private readonly _assetId: string;
    private readonly _stateId: string;
    private readonly _distributionType: string;
    private readonly _distributionValue: number;

    /**
     * Class constructor.
     * @param assetId The asset identifier.
     * @param distributionType The distribution type.
     * @param distributionValue The distribution value.
     * @param stateId The state identifier.
     */


    constructor(assetId: string, stateId: string, distributionType: string, distributionValue: number) {
        this._assetId = assetId;
        this._stateId = stateId;
        this._distributionType = distributionType;
        this._distributionValue = distributionValue;
    }


    get assetId(): string {
        return this._assetId;
    }

    get stateId(): string {
        return this._stateId;
    }

    get distributionType(): string {
        return this._distributionType;
    }

    get distributionValue(): number {
        return this._distributionValue;
    }
}