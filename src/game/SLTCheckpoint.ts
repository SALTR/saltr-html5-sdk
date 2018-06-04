export class SLTCheckpoint {
    static CHECKPOINT_ORIENTATION_HORIZONTAL:string = "horizontal";
    static CHECKPOINT_ORIENTATION_VERTICAL:string = "vertical";

    private readonly _token:string;
    private readonly _orientation:string;
    private readonly _position:number;


    constructor(token: string, orientation: string, position: number) {
        this._token = token;
        this._orientation = orientation;
        this._position = position;
    }


    get token(): string {
        return this._token;
    }

    get orientation(): string {
        return this._orientation;
    }

    get position(): number {
        return this._position;
    }
}