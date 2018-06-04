/**
 * The SLTCell class represents the matching board cell.
 */
import {Dictionary} from "../../Dictionary";
import {SLTAssetInstance} from "../SLTAssetInstance";

export class SLTCell {
    private _col: number;
    private _row: number;
    private _properties: Dictionary<any>;
    private _isBlocked: boolean;
    private _instancesByLayerId: Dictionary<any>;
    private _instancesByLayerIndex: Dictionary<any>;

    /**
     * Class constructor.
     * @param col The column of the cell.
     * @param row The row of the cell.
     */
    constructor(col: number, row: number) {
        this._col = col;
        this._row = row;
        this._properties = {};
        this._isBlocked = false;
        this._instancesByLayerId = {};
        this._instancesByLayerIndex = {};
    }


    get col(): number {
        return this._col;
    }

    set col(value: number) {
        this._col = value;
    }

    get row(): number {
        return this._row;
    }

    set row(value: number) {
        this._row = value;
    }

    get properties(): Dictionary<any> {
        return this._properties;
    }

    set properties(value: Dictionary<any>) {
        this._properties = value;
    }

    get isBlocked(): boolean {
        return this._isBlocked;
    }

    set isBlocked(value: boolean) {
        this._isBlocked = value;
    }

    get instancesByLayerId(): Dictionary<any> {
        return this._instancesByLayerId;
    }

    set instancesByLayerId(value: Dictionary<any>) {
        this._instancesByLayerId = value;
    }

    get instancesByLayerIndex(): Dictionary<any> {
        return this._instancesByLayerIndex;
    }

    set instancesByLayerIndex(value: Dictionary<any>) {
        this._instancesByLayerIndex = value;
    }

    /**
     * Returns the asset instance by layer identifier.
     * @param layerId The layer identifier.
     * @return SLTAssetInstance The asset instance that is positioned in the cell in the layer specified by layerId.
     */
    getAssetInstanceByLayerId(layerId: string): SLTAssetInstance {
        return this._instancesByLayerId[layerId];
    }

    /**
     * Returns the asset instance by layer index.
     * @param layerIndex The layer index.
     * @return SLTAssetInstance The asset instance that is positioned in the cell in the layer specified by layerIndex.
     */
    getAssetInstanceByLayerIndex(layerIndex: number): SLTAssetInstance {
        return this._instancesByLayerIndex[layerIndex];
    }

    /**
     * Sets the asset instance with provided layer identifier and layer index.
     * @param layerId The layer identifier.
     * @param layerIndex The layer index.
     * @param assetInstance The asset instance.
     * @private
     */
    setAssetInstance(layerId: string, layerIndex: number, assetInstance: SLTAssetInstance): void {
        if (this._isBlocked == false) {
            this._instancesByLayerId[layerId] = assetInstance;
            this._instancesByLayerIndex[layerIndex] = assetInstance;
        }
    }

    /**
     * Removes the asset instance with provided layer identifier and layer index.
     * @param layerId The layer identifier.
     * @param layerIndex The layer index.
     * @private
     */
    removeAssetInstance(layerId: string, layerIndex: number): void {
        delete this._instancesByLayerId[layerId];
        delete this._instancesByLayerIndex[layerIndex];
    }
}