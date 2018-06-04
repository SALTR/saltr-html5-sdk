/**
 * The SLTAssetInstance class represents the game asset instance placed on board.
 * It holds the unique identifier of the asset and current instance related states and properties.
 */
import {SLTAssetState} from "./SLTAssetState";

export class SLTAssetInstance {
    private readonly _token:string;
    private readonly _state:SLTAssetState;
    private readonly _properties:any;


    constructor(token: string, state: SLTAssetState, properties: any) {
        this._token = token;
        this._state = state;
        this._properties = properties;
    }

    get token(): string {
        return this._token;
    }

    get state(): SLTAssetState {
        return this._state;
    }

    get properties(): any {
        return this._properties;
    }
}