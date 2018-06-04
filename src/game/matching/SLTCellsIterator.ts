import {SLTCells} from "./SLTCells";
import {SLTCell} from "./SLTCell";

export class SLTCellsIterator {
    private  _cells:SLTCells;
    private  _vectorLength:number;
    private  _currentPosition:number;

    constructor(cells: SLTCells) {
        this._cells = cells;
        this.reset();
    }

    /**
     * Returns <code>true</code> if the iteration has more elements.
     * @return <code>true</code> if the iteration has more elements.
     */
    hasNext():boolean {
        return this._currentPosition != this._vectorLength;
    }

    /**
     * Return the next element in the iteration.
     * @return The next element in the iteration.
     */
    next():SLTCell {
        return this._cells.rawData[this._currentPosition++];
    }

    /**
     * Resets iterator to first element.
     */
    reset():void {
        this._vectorLength = this._cells.rawData.length;
        this._currentPosition = 0;
    }
}