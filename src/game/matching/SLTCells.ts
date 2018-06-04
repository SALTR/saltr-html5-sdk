/**
 * The SLTCells class provides convenient access to board cells.
 */
import {SLTCellsIterator} from "./SLTCellsIterator";
import {SLTCell} from "./SLTCell";

export class SLTCells {
    private readonly _width: number;
    private readonly _height: number;
    private readonly _rawData: SLTCell[];
    private readonly _iterator: SLTCellsIterator;

    /**
     * Class constructor.
     * @param width The number of columns.
     * @param height The number of rows.
     */
    constructor(width: number, height: number) {
        if(width < 0 || height < 0) {
            throw new Error("Incorrect width, or height passed.");
        }
        this._width = width;
        this._height = height;
        this._rawData = [];
    }

    /**
     * Inserts cell at given column and row.
     * @param col The column.
     * @param row The row.
     * @param cell The cell.
     */
    insert(col: number, row: number, cell:SLTCell):void {
        if(col < 0 || row < 0) {
            throw new Error("Incorrect col, or row passed.");
        }
        this._rawData[ (row * this._width) + col] = cell;
    }

    /**
     * Retrieves the cell specified by column and row.
     * @param col The column.
     * @param row The row.
     * @return The cell at given col and row.
     */
    retrieve(col: number, row: number):SLTCell {
        if(col < 0 || row < 0) {
            throw new Error("Incorrect col, or row passed.");
        }
        let retVal:SLTCell = null;
        if(col < this._width && row < this._height) {
            retVal = this._rawData[(row * this._width) + col];
        }
        return retVal;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get rawData(): SLTCell[] {
        return this._rawData;
    }

    get iterator(): SLTCellsIterator {
        return this._iterator;
    }
}