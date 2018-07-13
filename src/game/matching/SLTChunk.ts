/**
 * The SLTChunk class represents a collection of cells on matching board that is populated with assets according to certain rules.
 */
import {SLTChunkAssetRule} from "./SLTChunkAssetRule";
import {SLTCell} from "./SLTCell";
import {Dictionary} from "../../Dictionary";
import {SLTChunkAssetDatum} from "./SLTChunkAssetDatum";
import {SLTAsset} from "../SLTAsset";
import {SLTAssetInstance} from "../SLTAssetInstance";

export class SLTChunk {
    private readonly _layerToken: string;
    private readonly _layerIndex: number;
    private readonly _chunkAssetRules: SLTChunkAssetRule[];
    private readonly _matchingRuleEnabled: boolean;
    private readonly _chunkCells: SLTCell[];
    private _availableCells: SLTCell[];
    private readonly _assetMap: Dictionary<any>;
    private readonly _availableAssetData: SLTChunkAssetDatum[];
    private readonly _uniqueInAvailableAssetData: SLTChunkAssetDatum[];
    private readonly _uniqueInCountAssetData: SLTChunkAssetDatum[];

    private static randomWithin(min: number, max: number, isFloat: boolean = false): number {
        return isFloat ? Math.random() * (1 + max - min) + min : Math.random() * (1 + max - min) + min;
    }


    constructor(layerToken:string, layerIndex:number, chunkCells:SLTCell[], chunkAssetRules:SLTChunkAssetRule[],
                matchingRuleEnabled:boolean, assetMap:Dictionary<any>) {
        this._layerToken = layerToken;
        this._layerIndex = layerIndex;
        this._chunkCells = chunkCells;
        this._chunkAssetRules = chunkAssetRules;
        this._matchingRuleEnabled = matchingRuleEnabled;
        this._assetMap = assetMap;
        this._availableAssetData = [];
        this._uniqueInAvailableAssetData = [];
        this._uniqueInCountAssetData = [];
    }

    /**
     * Returns the available cells count plus chunk asset rules count as string.
     */
    toString(): string {
        return "[Chunk] cells:" + this._availableCells.length + ", " + " chunkAssets: " + this._chunkAssetRules.length;
    }


    get matchingRuleEnabled(): boolean {
        return this._matchingRuleEnabled;
    }

    get cells(): SLTCell[] {
        return this._chunkCells;
    }

    get availableAssetData(): SLTChunkAssetDatum[] {
        return this._availableAssetData;
    }

    get uniqueInAvailableAssetData(): SLTChunkAssetDatum[] {
        return this._uniqueInAvailableAssetData;
    }

    get uniqueInCountAssetData(): SLTChunkAssetDatum[] {
        return this._uniqueInCountAssetData;
    }

    hasCellWithPosition(col: number, row: number): boolean {
        return this._chunkCells.some(cell => col == cell.col && row == cell.row);
    }

    addAssetInstanceWithPosition(assetDatum: SLTChunkAssetDatum, col: number, row: number): void {
        this.addAssetInstanceWithCellIndex(assetDatum, this.getCellIndexWithPosition(col, row));
    }

    addAssetInstanceWithCellIndex(assetDatum: SLTChunkAssetDatum, cellIndex: number): void {
        let asset: SLTAsset = this._assetMap[assetDatum.assetId] as SLTAsset;
        let cell: SLTCell = this._chunkCells[cellIndex];
        let stateId: string = assetDatum.stateId;
        cell.setAssetInstance(this._layerToken, this._layerIndex, new SLTAssetInstance(asset.token, asset.getInstanceState(stateId), asset.properties));
    }

    generateAssetData(): void {
        //resetting chunk cells, as when chunk can contain empty cells, previous generation can leave assigned values to cells
        this.resetChunkCells();
        this._availableAssetData.length = 0;
        this._uniqueInAvailableAssetData.length = 0;
        this._uniqueInCountAssetData.length = 0;

        //availableCells are being always overwritten here, so no need to initialize
        this._availableCells = this._chunkCells.concat();

        const countChunkAssetRules: SLTChunkAssetRule[] = [];
        const ratioChunkAssetRules: SLTChunkAssetRule[] = [];
        const randomChunkAssetRules: SLTChunkAssetRule[] = [];

        for (let i: number = 0, len: number = this._chunkAssetRules.length; i < len; ++i) {
            const assetRule: SLTChunkAssetRule = this._chunkAssetRules[i];
            switch (assetRule.distributionType) {
                case SLTChunkAssetRule.ASSET_DISTRIBUTION_TYPE_COUNT:
                    countChunkAssetRules.push(assetRule);
                    break;
                case SLTChunkAssetRule.ASSET_DISTRIBUTION_TYPE_RATIO:
                    ratioChunkAssetRules.push(assetRule);
                    break;
                case SLTChunkAssetRule.ASSET_DISTRIBUTION_TYPE_RANDOM:
                    randomChunkAssetRules.push(assetRule);
                    break;
            }
        }

        if (countChunkAssetRules.length > 0) {
            this.generateAssetDataByCount(countChunkAssetRules);
        }
        if (ratioChunkAssetRules.length > 0) {
            this.generateAssetDataByRatio(ratioChunkAssetRules);
        }
        else if (randomChunkAssetRules.length > 0) {
            this.generateAssetInstancesRandomly(randomChunkAssetRules);
        }
        this._availableCells.length = 0;
    }

    private resetChunkCells(): void {
        for (let i: number = 0, len: number = this._chunkCells.length; i < len; ++i) {
            this._chunkCells[i].removeAssetInstance(this._layerToken, this._layerIndex);
        }
    }

    private addToAvailableAssetData(assetData: SLTChunkAssetDatum[]): void {
        for (let i: number = 0, length: number = assetData.length; i < length; ++i) {
            this._availableAssetData.push(assetData[i]);
        }
    }

    private addToUniqueInAvailableAssetData(assetDatum: SLTChunkAssetDatum): void {
        this._uniqueInAvailableAssetData.push(assetDatum);
    }

    private addToUniqueInCountAssetData(assetDatum: SLTChunkAssetDatum): void {
        this._uniqueInCountAssetData.push(assetDatum);
    }

    private generateAssetDataByCount(countChunkAssetRules: SLTChunkAssetRule[]): void {
        for (let i: number = 0, len: number = countChunkAssetRules.length; i < len; ++i) {
            let assetRule: SLTChunkAssetRule = countChunkAssetRules[i];
            this.addToAvailableAssetData(this.getAssetData(assetRule.distributionValue, assetRule.assetId, assetRule.stateId));
            this.addToUniqueInCountAssetData(new SLTChunkAssetDatum(assetRule.assetId, assetRule.stateId, this._assetMap));
        }
    }

    private generateAssetDataByRatio(ratioChunkAssetRules: SLTChunkAssetRule[]): void {
        let ratioSum: number = 0;
        const len: number = ratioChunkAssetRules.length;
        let assetRule: SLTChunkAssetRule;
        for (let i: number = 0; i < len; ++i) {
            assetRule = ratioChunkAssetRules[i];
            ratioSum += assetRule.distributionValue;
        }
        let availableCellsNum: number = this._availableCells.length;
        let proportion: number;
        let count: number;

        const fractionAssets: any[] = [];
        if (ratioSum != 0) {
            for (let j: number = 0; j < len; ++j) {
                assetRule = ratioChunkAssetRules[j];
                proportion = assetRule.distributionValue / ratioSum * availableCellsNum;
                count = proportion; //assigning number to int to floor the value;
                fractionAssets.push({fraction: proportion - count, assetRule: assetRule});
                this.addToAvailableAssetData(this.getAssetData(count, assetRule.assetId, assetRule.stateId));
                this.addToUniqueInAvailableAssetData(new SLTChunkAssetDatum(assetRule.assetId, assetRule.stateId, this._assetMap));
            }

            fractionAssets.sort((a, b) => {
                return b.fraction - a.fraction;
            });
            availableCellsNum = this._availableCells.length;

            for (let k: number = 0; k < availableCellsNum; ++k) {
                this.addToAvailableAssetData(this.getAssetData(1, fractionAssets[k].assetRule.assetId, fractionAssets[k].assetRule.stateId));
                this.addToUniqueInAvailableAssetData(new SLTChunkAssetDatum(fractionAssets[k].assetRule.assetId, fractionAssets[k].assetRule.stateId, this._assetMap));
            }
        }
    }

    private generateAssetInstancesRandomly(randomChunkAssetRules: SLTChunkAssetRule[]): void {
        const len: number = randomChunkAssetRules.length;
        const availableCellsNum: number = this._availableCells.length;
        if (len > 0) {
            const assetConcentration: number = availableCellsNum > len ? availableCellsNum / len : 1;
            const minAssetCount: number = assetConcentration <= 2 ? 1 : assetConcentration - 2;
            const maxAssetCount: number = assetConcentration == 1 ? 1 : assetConcentration + 2;
            const lastChunkAssetIndex: number = len - 1;

            let chunkAssetRule: SLTChunkAssetRule;
            let count: number;
            for (let i: number = 0; i < len && this._availableCells.length > 0; ++i) {
                chunkAssetRule = randomChunkAssetRules[i];
                count = i == lastChunkAssetIndex ? this._availableCells.length : SLTChunk.randomWithin(minAssetCount, maxAssetCount);
                this.addToAvailableAssetData(this.getAssetData(count, chunkAssetRule.assetId, chunkAssetRule.stateId));
                this.addToUniqueInAvailableAssetData(new SLTChunkAssetDatum(chunkAssetRule.assetId, chunkAssetRule.stateId, this._assetMap));
            }
        }
    }

    private getAssetData(count: number, assetId: string, stateId: string): SLTChunkAssetDatum[] {
        const assetData: SLTChunkAssetDatum[] = [];
        for (let i: number = 0; i < count; ++i) {
            assetData.push(new SLTChunkAssetDatum(assetId, stateId, this._assetMap));
            this._availableCells.splice(0, 1);
            if (0 == this._availableCells.length) {
                break;
            }
        }
        return assetData;
    }

    private getCellWithPosition(col: number, row: number): SLTCell {
        for (let i: number = 0, length: number = this._chunkCells.length; i < length; ++i) {
            const cell: SLTCell = this._chunkCells[i];
            if (col == cell.col && row == cell.row) {
               return cell;
            }
        }
        return null;
    }

    private getCellIndexWithPosition(col: number, row: number): number {
        for (let i: number = 0, length: number = this._chunkCells.length; i < length; ++i) {
            const cell: SLTCell = this._chunkCells[i];
            if (col == cell.col && row == cell.row) {
               return i;
            }
        }
        return -1;
    }
}