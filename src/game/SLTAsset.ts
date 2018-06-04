import {Dictionary} from "../Dictionary";
import {SLTAssetState} from "./SLTAssetState";

/**
 * The SLTAsset class represents the game asset.
 */
export class SLTAsset {
    protected readonly _properties: any;
    protected readonly _stateMap: Dictionary<SLTAssetState>;
    protected readonly _token: string;

    /**
     * Class constructor.
     * @param token The unique identifier of the asset.
     * @param stateMap The states.
     * @param properties The properties.
     */
    constructor(properties: any, stateMap: Dictionary<any>, token: string) {
        this._properties = properties;
        this._stateMap = stateMap;
        this._token = token;
    }


    get properties(): any {
        return this._properties;
    }

    get token(): string {
        return this._token;
    }

    /**
     * Returns instance states by provided state identifiers.
     * @param stateId The state identifier.
     */
    getInstanceState(stateId: string): SLTAssetState {
        return this._stateMap[stateId];
    }

    /**
     * Returns token plus properties string.
     */
    toString(): string {
        return "[Asset] token: " + this._token + ", " + " properties: " + this._properties;
    }
}