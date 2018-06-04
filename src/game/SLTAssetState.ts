/**
 * The SLTAssetState class represents the asset state and provides the state related properties.
 */
export class SLTAssetState {
    private readonly _token: string;


    constructor(token: string) {
        this._token = token;
    }

    get token(): string {
        return this._token;
    }
}