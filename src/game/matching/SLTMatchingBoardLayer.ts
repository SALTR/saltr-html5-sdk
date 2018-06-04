import {SLTBoardLayer} from "../SLTBoardLayer";
import {SLTChunk} from "./SLTChunk";

export class SLTMatchingBoardLayer extends SLTBoardLayer {
    private readonly _chunks: SLTChunk[];
    private readonly _assetRules: any[];

    constructor(token: string, layerIndex: number, assetRules: any[]) {
        super(token, layerIndex);
        this._chunks = [];
        this._assetRules = assetRules;
    }

    get chunks(): SLTChunk[] {
        return this._chunks;
    }

    get assetRules(): any[] {
        return this._assetRules;
    }

    getChunkWithCellPosition(col: number, row: number): SLTChunk {
        let chunksFiltered = this._chunks.filter(chunk => chunk.hasCellWithPosition(col, row));
        return chunksFiltered.length > 0 ? chunksFiltered[0] : null
    }

    /**
     * Adds a chunk.
     * @param chunk The chunk to add.
     * @private
     */
    addChunk(chunk: SLTChunk): void {
        this._chunks.push(chunk);
    }
}