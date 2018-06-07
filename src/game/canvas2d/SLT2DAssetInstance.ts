/**
 * The SLT2DAssetInstance class represents the game 2D asset instance placed on board.
 */
import {SLTAssetInstance} from "../SLTAssetInstance";
import {Dictionary} from "../../Dictionary";
import {SLTAssetState} from "../SLTAssetState";
import {SLT2DAssetState} from "./SLT2DAssetState";
import {Point} from "./Point";

export class SLT2DAssetInstance extends SLTAssetInstance {

    private readonly _x:number;
    private readonly _y:number;
    private readonly _scaleX:number;
    private readonly _scaleY:number;
    private readonly _rotation:number;

    constructor(token: string, state: SLTAssetState, properties: any, x: number, y: number, scaleX: number, scaleY: number, rotation: number, positions: Dictionary<any>) {
        super(token, state, properties);
        this._x = x;
        this._y = y;
        this._scaleX = scaleX;
        this._scaleY = scaleY;
        this._rotation = rotation;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get rotation(): number {
        return this._rotation;
    }

    private getScaleAppliedState(state:SLTAssetState):SLTAssetState {
        const clonedState: SLT2DAssetState = (state as SLT2DAssetState).clone();
        clonedState.width = clonedState.width * this._scaleX;
        clonedState.height = clonedState.height * this._scaleY;
        return clonedState;
    }
}