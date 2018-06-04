/**
 * The SLTBoardLayer class represents the game board's layer.
 */
export class SLTBoardLayer {
    private readonly _token:string;
    private readonly _index:number;

    constructor(token: string, index: number) {
        this._token = token;
        this._index = index;
    }

    get token(): string {
        return this._token;
    }

    get index(): number {
        return this._index;
    }
}