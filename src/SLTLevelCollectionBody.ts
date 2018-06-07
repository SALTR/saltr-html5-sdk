import {SLTLevel} from "./game/SLTLevel";
import {SLTDeserializer} from "./SLTDeserializer";

export class SLTLevelCollectionBody {

    private readonly _levels:SLTLevel[];

    /**
     * Class constructor.
     */
    constructor(data:any) {
        this._levels = SLTDeserializer.decodeAndCreateNewLevels(data);
        this.sortLevel();
    }

    /**
     * All levels
     */
    public get allLevels():SLTLevel[] {
        return this._levels;
    }

    /**
     * All levels count.
     */
    public get allLevelsCount():number {
        return this._levels.length;
    }

    /**
     *
     */
    public updateLevels(data:any):void {
        SLTDeserializer.decodeAndUpdateExistingLevels(data, this._levels);
    }

    /**
     * Provides level with given level token
     * @param token The token of the level
     */
    public getLevelByToken(token:string):SLTLevel {
        for (let i:number = 0; i < this._levels.length; ++i) {
            const level: SLTLevel = this._levels[i];
            if (token == level.levelToken) {
                return level;
            }
        }
        return null;
    }

    /**
     * Provides level with given global index
     * @param index The global index
     */
    public getLevelByGlobalIndex(index:number):SLTLevel {
        if (index < 0 || index >= this._levels.length) {
            return null;
        }
        for (let i:number = 0; i < this._levels.length; ++i) {
            const level: SLTLevel = this._levels[i];
            if (index == level.globalIndex) {
                return level;
            }
        }
        return null;
    }

    private sortLevel():void {
        this._levels.sort((level1:SLTLevel, level2:SLTLevel) => {
            return level1.globalIndex - level2.globalIndex;
        })
    }

    private disposeLevels():void {
        this._levels.length = 0;
    }

}