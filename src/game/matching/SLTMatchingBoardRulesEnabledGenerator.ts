import {SLTChunk} from "./SLTChunk";
import {SLTChunkAssetDatum} from "./SLTChunkAssetDatum";
import {SLTMatchingBoardConfig} from "./SLTMatchingBoardConfig";
import {SLTMatchingBoardLayer} from "./SLTMatchingBoardLayer";
import {SLTMatchingBoardGeneratorBase} from "./SLTMatchingBoardGeneratorBase";
import {SLTCell} from "./SLTCell";
import {SLTCells} from "./SLTCells";
import {SLTAssetInstance} from "../SLTAssetInstance";

export class SLTMatchingBoardRulesEnabledGenerator extends SLTMatchingBoardGeneratorBase {
    private static INSTANCE: SLTMatchingBoardRulesEnabledGenerator;

    private _boardConfig: SLTMatchingBoardConfig;
    private _layer: SLTMatchingBoardLayer;
    private _matchedAssetPositions: MatchedAssetPosition[];

    static getInstance(): SLTMatchingBoardRulesEnabledGenerator {
        if (!SLTMatchingBoardRulesEnabledGenerator.INSTANCE) {
            SLTMatchingBoardRulesEnabledGenerator.INSTANCE = new SLTMatchingBoardRulesEnabledGenerator();
        }
        return SLTMatchingBoardRulesEnabledGenerator.INSTANCE;
    }

    private constructor() {
        super();
    }

    generate(boardConfig: SLTMatchingBoardConfig, layer: SLTMatchingBoardLayer): void {
        this._boardConfig = boardConfig;
        this._layer = layer;
        if (null == this._matchedAssetPositions) {
            this._matchedAssetPositions = [];
        }
        super.parseFixedAssets(layer, this._boardConfig.cells, this._boardConfig.assetMap);
        this.parseMatchingRuleDisabledChunks();
        this.generateLayer(layer);
    }

    private parseMatchingRuleDisabledChunks(): void {
        const chunks: SLTChunk[] = [];
        for (let i: number = 0, length: number = this._layer.chunks.length; i < length; ++i) {
            const chunk: SLTChunk = this._layer.chunks[i];
            if (false == chunk.matchingRuleEnabled) {
                chunks.push(chunk);
            }
        }
        if (chunks.length > 0) {
            this.generateAssetData(chunks);
            this.fillLayerChunkAssets(chunks);
        }
    }

    private getMatchingRuleEnabledChunks(layer: SLTMatchingBoardLayer): SLTChunk[] {
        const chunks: SLTChunk[] = [];
        for (let i: number = 0, length: number = this._layer.chunks.length; i < length; ++i) {
            const chunk: SLTChunk = this._layer.chunks[i];
            if (chunk.matchingRuleEnabled) {
                chunks.push(chunk);
            }
        }
        return chunks;
    }

    private generateLayer(layer:SLTMatchingBoardLayer):void {
        this._matchedAssetPositions.length = 0;
        this.generateAssetData(this.getMatchingRuleEnabledChunks(layer));
        this.fillLayerChunkAssetsWithMatchingRules();
        if (this._matchedAssetPositions.length > 0) {
            this.correctChunksMatchesWithChunkAssets();
        }
        if (this._matchedAssetPositions.length > 0) {
            this.fillLayerMissingChunkAssetsWithoutMatchingRules(layer);
        }
    }

    private fillLayerMissingChunkAssetsWithoutMatchingRules(layer: SLTMatchingBoardLayer): void {
        let correctionAssets: SLTChunkAssetDatum[] = null;
        for (let i: number = 0, length: number = this._matchedAssetPositions.length; i < length; ++i) {
            const matchedCellPosition: MatchedAssetPosition = this._matchedAssetPositions[i];
            const chunk: SLTChunk = this._layer.getChunkWithCellPosition(matchedCellPosition.col, matchedCellPosition.row);
            if (chunk.uniqueInAvailableAssetData.length > 0) {
                correctionAssets = chunk.uniqueInAvailableAssetData.concat();
            }
            if ((null == correctionAssets) || (null != correctionAssets && correctionAssets.length <= 0)) {
                correctionAssets = chunk.uniqueInCountAssetData.concat();
            }
            if (null != correctionAssets && correctionAssets.length > 0) {
                this.appendChunkAssetWithoutMatchCheck(correctionAssets[0], chunk, matchedCellPosition.col, matchedCellPosition.row);
                correctionAssets.length = 0;
                correctionAssets = null;
            }
        }
    }

    private correctChunksMatchesWithChunkAssets(): void {
        let correctionAssets: SLTChunkAssetDatum[];
        let appendingResult: Boolean = false;

        for (let i: number = this._matchedAssetPositions.length - 1; i >= 0; --i) {
            const matchedCellPosition: MatchedAssetPosition = this._matchedAssetPositions[i];
            const chunk: SLTChunk = this._layer.getChunkWithCellPosition(matchedCellPosition.col, matchedCellPosition.row);
            correctionAssets = chunk.uniqueInAvailableAssetData;
            for (let j: number = 0, assetsLength: number = correctionAssets.length; j < assetsLength; ++j) {
                appendingResult = this.appendChunkAssetWithMatchCheck(correctionAssets[j], chunk, matchedCellPosition.col, matchedCellPosition.row);
                if (appendingResult) {
                    this._matchedAssetPositions.splice(i, 1);
                    break;
                }
            }
        }
    }

    private fillLayerChunkAssetsWithMatchingRules(): void {
        const positionCells: any[] = [];
        let chunkAvailableAssetData: SLTChunkAssetDatum[];
        let assetDatum: SLTChunkAssetDatum;
        let appendResult: Boolean;

        for (let y: number = 0, rows: number = this._boardConfig.rows; y < rows; ++y) {
            for (let x: number = 0, cols: number = this._boardConfig.cols; x < cols; ++x) {
                positionCells.push([x, y]);
            }
        }

        let cellRandomIndex: number = Math.floor(Math.random() * positionCells.length);
        let chunkAssetIndex: number = 0;

        while (positionCells.length > 0) {
            const x = positionCells[cellRandomIndex][0];
            const y = positionCells[cellRandomIndex][1];

            const chunk: SLTChunk = this._layer.getChunkWithCellPosition(x, y);

            if (null != chunk && chunk.matchingRuleEnabled && chunk.availableAssetData.length > 0) {
                chunkAvailableAssetData = chunk.availableAssetData;

                assetDatum = null;
                if (chunkAssetIndex < chunkAvailableAssetData.length) {
                    assetDatum = chunkAvailableAssetData[chunkAssetIndex];
                }

                if (null != assetDatum && "" != assetDatum.assetToken) {
                    appendResult = this.appendChunkAssetWithMatchCheck(assetDatum, chunk, x, y);
                    if (appendResult) {
                        chunkAvailableAssetData.splice(chunkAssetIndex, 1);
                        positionCells.splice(cellRandomIndex, 1);
                        chunkAssetIndex = 0;
                        cellRandomIndex = Math.floor(Math.random() * positionCells.length);
                        this.removeFromMatchedAssetPosition(x, y);
                    }
                    else {
                        this.addMatchedAssetPosition(x, y);
                        ++chunkAssetIndex;
                    }
                }
                else {
                    chunkAssetIndex = 0;
                    positionCells.splice(cellRandomIndex, 1);
                    cellRandomIndex = Math.floor(Math.random() * positionCells.length);
                }
            }
            else {
                positionCells.splice(cellRandomIndex, 1);
                cellRandomIndex = Math.floor(Math.random() * positionCells.length);
            }
        }
    }

    private addMatchedAssetPosition(x: number, y: number): void {
        let positionFound: Boolean = false;
        for (let i: number = 0, length: number = this._matchedAssetPositions.length; i < length; ++i) {
            const currentPosition: MatchedAssetPosition = this._matchedAssetPositions[i];
            if (x == currentPosition.col && y == currentPosition.row) {
                positionFound = true;
                break;
            }
        }
        if (!positionFound) {
            this._matchedAssetPositions.push(new MatchedAssetPosition(x, y));
        }
    }

    private removeFromMatchedAssetPosition(x: number, y: number): void {
        for (let i: number = 0, length: number = this._matchedAssetPositions.length; i < length; ++i) {
            const currentPosition: MatchedAssetPosition = this._matchedAssetPositions[i];
            if (x == currentPosition.col && y == currentPosition.row) {
                this._matchedAssetPositions.splice(i, 1);
                break;
            }
        }
    }

    private appendChunkAssetWithMatchCheck(assetDatum: SLTChunkAssetDatum, chunk: SLTChunk, col: number, row: number): Boolean {
        const matchesCount: number = this._boardConfig.matchSize - 1;
        const horizontalMatches: number = this.calculateHorizontalMatches(assetDatum.assetToken, col, row);
        const verticalMatches: number = this.calculateVerticalMatches(assetDatum.assetToken, col, row);
        let squareMatch: Boolean = false;
        let excludedAsset: Boolean = false;
        const excludedMathAssets: SLTChunkAssetDatum[] = this._boardConfig.excludedMatchAssets;

        if (this._boardConfig.squareMatchingRuleEnabled) {
            squareMatch = this.checkSquareMatch(assetDatum.assetToken, col, row);
        }

        for (let i = 0, length: number = excludedMathAssets.length; i < length; ++i) {
            if (assetDatum.assetId == excludedMathAssets[i].assetId) {
                excludedAsset = true;
                break;
            }
        }

        if (excludedAsset || (horizontalMatches < matchesCount && verticalMatches < matchesCount && !squareMatch)) {
            this.addAssetInstanceToChunk(assetDatum, chunk, col, row);
            return true;
        }
        return false;
    }

    private appendChunkAssetWithoutMatchCheck(assetDatum: SLTChunkAssetDatum, chunk: SLTChunk, col: number, row: number): void {
        this.addAssetInstanceToChunk(assetDatum, chunk, col, row);
    }

    private calculateHorizontalMatches(assetToken: string, col: number, row: number): number {
        let i: number = 1;
        let hasMatch: Boolean = true;
        const matchesCount: number = this._boardConfig.matchSize - 1;
        let siblingCellAssetToken: string;
        let horizontalMatches: number = 0;

        while (i <= Math.min(col, matchesCount) && hasMatch) {
            siblingCellAssetToken = this.getAssetTokenAtPosition(this._boardConfig.cells, col - i, row, this._layer.token);
            hasMatch = (assetToken == siblingCellAssetToken);
            if (hasMatch) {
                ++horizontalMatches;
                ++i;
            }
        }

        i = 1;
        hasMatch = true;

        while (i <= Math.min(this._boardConfig.cols - col - 1, matchesCount) && hasMatch) {
            siblingCellAssetToken = this.getAssetTokenAtPosition(this._boardConfig.cells, col + i, row, this._layer.token);
            hasMatch = (assetToken == siblingCellAssetToken);
            if (hasMatch) {
                ++horizontalMatches;
                ++i;
            }
        }

        return horizontalMatches;
    }

    private calculateVerticalMatches(assetToken: string, col: number, row: number): number {
        let i: number = 1;
        let hasMatch: boolean = true;
        const matchesCount: number = this._boardConfig.matchSize - 1;
        let siblingCellAssetToken: string;
        let verticalMatches: number = 0;

        while (i <= Math.min(row, matchesCount) && hasMatch) {
            siblingCellAssetToken = this.getAssetTokenAtPosition(this._boardConfig.cells, col, row - i, this._layer.token);
            hasMatch = (assetToken == siblingCellAssetToken);
            if (hasMatch) {
                ++verticalMatches;
                ++i;
            }
        }

        i = 1;
        hasMatch = true;

        while (i <= Math.min(this._boardConfig.rows - row - 1, matchesCount) && hasMatch) {
            siblingCellAssetToken = this.getAssetTokenAtPosition(this._boardConfig.cells, col, row + i, this._layer.token);
            hasMatch = (assetToken == siblingCellAssetToken);
            if (hasMatch) {
                ++verticalMatches;
                ++i;
            }
        }

        return verticalMatches;
    }

    private checkSquareMatch(assetToken: string, col: number, row: number): Boolean {
        let directionMatchesCount: number = 0;
        const directions: any[] = [
            [
                [-1, 0],
                [-1, -1],
                [0, -1]
            ],
            [
                [0, -1],
                [1, -1],
                [1, 0]
            ],
            [
                [1, 0],
                [1, 1],
                [0, 1]
            ],
            [
                [0, 1],
                [-1, 1],
                [-1, 0]
            ]
        ];
        let direction: any;
        let hasMatch: Boolean = false;
        let siblingCellAssetToken: string;

        for (let i: number = 0, lengthA: number = directions.length; i < lengthA; ++i) {
            directionMatchesCount = 0;
            direction = directions[i];

            for (let j: number = 0, lengthB: number = direction.length; j < lengthB; ++j) {
                siblingCellAssetToken = this.getAssetTokenAtPosition(this._boardConfig.cells, col + direction[j][0], row + direction[j][1], this._layer.token);

                if (assetToken == siblingCellAssetToken) {
                    ++directionMatchesCount;
                }
                else {
                    break;
                }
            }

            if (directionMatchesCount == 3) {
                hasMatch = true;
                break;
            }
        }

        return hasMatch;
    }

    private getAssetTokenAtPosition(boardCells: SLTCells, col: number, row: number, layerToken: string): string {
        let assetToken: string = "";
        if (col < 0 || row < 0) {
            return assetToken;
        }
        const cell: SLTCell = boardCells.retrieve(col, row);
        if (null != cell) {
            var assetInstance: SLTAssetInstance = cell.getAssetInstanceByLayerId(layerToken);
            if (null != assetInstance) {
                assetToken = cell.getAssetInstanceByLayerId(layerToken).token;
            }
        }
        return assetToken;
    }

    private addAssetInstanceToChunk(assetDatum: SLTChunkAssetDatum, chunk: SLTChunk, col: number, row: number): void {
        chunk.addAssetInstanceWithPosition(assetDatum, col, row);
    }
}

class MatchedAssetPosition {
    private readonly _col: number;
    private readonly _row: number;


    constructor(col: number, row: number) {
        this._col = col;
        this._row = row;
    }

    get col(): number {
        return this._col;
    }

    get row(): number {
        return this._row;
    }
}