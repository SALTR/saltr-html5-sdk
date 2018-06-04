/**
 * The SLTLevelData class provides the level data.
 */
import {SLTLevel} from "./game/SLTLevel";
import {SLTDeserializer} from "./SLTDeserializer";

class SLTLevelData {

    private _levels: SLTLevel[];

    /**
     * Class constructor.
     */
    constructor() {
        this._levels = [];
    }

    /**
     * All levels
     */
    public get allLevels(): SLTLevel[] {
        return this._levels;
    }

    /**
     * All levels count.
     */
    public get allLevelsCount(): number {
        return this._levels.length;
    }

    /**
     * Provides level with given global index
     * @param index The global index
     */
    public getLevelByGlobalIndex(index: number): SLTLevel {
        if (index < 0 || index >= this._levels.length) {
            return null;
        }
        for (let i: number = 0; i < this._levels.length; ++i) {
            const level: SLTLevel = this._levels[i];
            if (index == level.globalIndex) {
                return level;
            }
        }
        return null;
    }

    initWithData(data: any): void {
        const newLevels: SLTLevel[] = SLTDeserializer.decodeLevels(data);
        try {
        } catch (e) {
            throw new Error("Levels parse error");
        }


        if (newLevels) {
            this.disposeLevels();
            this._levels = newLevels;
        }
    }

    private disposeLevels(): void {
        this._levels.length = 0;
    }
}


export {SLTLevelData}