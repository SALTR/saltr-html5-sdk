import {Dictionary} from "../Dictionary";
import {SLTBoardLayer} from "./SLTBoardLayer";
import {SLTCheckpoint} from "./SLTCheckpoint";

class SLTBoard {

    /**
     * Specifies the board type for matching game.
     */
    static readonly BOARD_TYPE_MATCHING: string = "matrix";

    /**
     * Specifies the board type for Canvas2D game.
     */
    static readonly BOARD_TYPE_CANVAS_2D: string = "canvas2d";


    protected _propertyObjects: Dictionary<any>;
    protected _layers: Dictionary<any>;
    private readonly _checkpoints: Dictionary<any>;
    private readonly _token: string;


    constructor(token:string, layers:Dictionary<any>, propertyObjects:Dictionary<any>, checkpoints:Dictionary<any>) {
        this._propertyObjects = propertyObjects;
        this._layers = layers;
        this._checkpoints = checkpoints;
        this._token = token;
    }

    /**
     * The board associated properties.
     */
    public get propertyObjects(): Object {
        return this._propertyObjects;
    }

    /**
     * The layers of the board.
     */
    public get layers(): Dictionary<any> {
        return this._layers;
    }

    /**
     * Returns layer of board. Null if there is no layer with requested token.
     * @param token The layer token to search.
     * @return
     */
    public getLayerByToken(token: string): SLTBoardLayer {
        return this._layers[token];
    }

    /**
     * Provides the checkpoint.
     * @param token The checkpoint's token.
     */
    public getCheckpoint(token: string): SLTCheckpoint {
        return this._checkpoints[token];
    }

    /**
     * Provides the checkpoints.
     */
    public getCheckpoints(): SLTCheckpoint[] {
        const checkpointVector: SLTCheckpoint[] = [];
        for (let key in this._checkpoints) {
            checkpointVector.push(this._checkpoints[key]);
        }
        return checkpointVector;
    }

    /**
     * Regenerates the content of the board.
     */
    public regenerate(): void {
        throw new Error("Virtual function call: regenerate");
    }

    get token(): string {
        return this._token;
    }
}

export {SLTBoard}