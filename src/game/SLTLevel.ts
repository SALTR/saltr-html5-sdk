/**
 * The SLTLevel class represents the game's level.
 */
import {SLTBoard} from "./SLTBoard";
import {SLTLevelParser} from "./SLTLevelParser";
import {Dictionary} from "../Dictionary";

class SLTLevel {
    private _matrixBoards: Dictionary<any>;
    private _canvas2DBoards: Dictionary<any>;

    private readonly _globalIndex: number;
    private readonly _localIndex: number;
    private readonly _packIndex: number;
    private _contentUrl: string;
    private _properties: Dictionary<any>;
    private readonly _version: string;

    private _contentReady: boolean;
    private _matrixAssetMap: Dictionary<any>;
    private _canvas2DAssetMap: Dictionary<any>;

    private _parser: SLTLevelParser;

    /**
     * Specifies that there is no level specified for the game.
     */
    public static readonly LEVEL_TYPE_NONE: string = "noLevels";

    /**
     * Class constructor.
     * @param globalIndex The global index of the level.
     * @param localIndex The local index of the level in the pack.
     * @param packIndex The index of the pack the level is in.
     * @param contentUrl The content URL of the level.
     * @param version The current version of the level.
     */
    public constructor(globalIndex: number, localIndex: number, packIndex: number, contentUrl: string, version: string) {
        this._globalIndex = globalIndex;
        this._localIndex = localIndex;
        this._packIndex = packIndex;
        this._contentUrl = contentUrl;
        this._version = version;
        this._contentReady = false;
        this._parser = SLTLevelParser.getInstance();
    }

    /**
     * The global index of the level.
     */
    public get globalIndex(): number {
        return this._globalIndex || 0;
    }

    /**
     * The local index of the level in the pack.
     */
    public get localIndex(): number {
        return this._localIndex || 0;
    }

    /**
     * The properties of the level.
     */
    public get properties(): Dictionary<any> {
        return this._properties;
    }

    /**
     * The content URL of the level.
     */
    public get contentUrl(): string {
        return this._contentUrl || '';
    }

    public set contentUrl(value: string) {
        this._contentUrl = value;
    }

    /**
     * The content ready state.
     */
    public get contentReady(): boolean {
        return this._contentReady || false;
    }

    /**
     * Updates contentReady value. For internal use only.
     * @param value
     */
    public set contentReady(value: boolean) {
        this._contentReady = value;
    }

    /**
     * The current version of the level.
     */
    public get version(): string {
        return this._version || '';
    }

    /**
     * The index of the pack the level is in.
     */
    public get packIndex(): number {
        return this._packIndex || 0;
    }

    /**
     * The matrix boards.
     */
    public get matrixBoards(): Dictionary<any> {
        return this._matrixBoards;
    }

    /**
     * The canvas 2D boards.
     */
    public get canvas2DBoards(): Dictionary<any> {
        return this._canvas2DBoards;
    }

    /**
     * Gets the matrix board by identifier.
     * @param token The board identifier.
     * @return The board with provided identifier.
     */
    public getMatrixBoard(token: string): SLTBoard {
        if (null != this._matrixBoards) {
            return this._matrixBoards[token];
        } else {
            return null;
        }
    }

    /**
     * Gets the canvas 2D board by identifier.
     * @param token The board identifier.
     * @return The board with provided identifier.
     */
    public getCanvas2DBoard(token: string): SLTBoard {
        if (null != this._canvas2DBoards) {
            return this._canvas2DBoards[token];
        } else {
            return null;
        }
    }

    /**
     * Updates the content of the level.
     */
    public updateContent(rootNode: any): void {
        this._properties = this._parser.parseLevelProperties(rootNode);

        try {
            this._matrixAssetMap = this._parser.parseAssets(rootNode, SLTBoard.BOARD_TYPE_MATCHING);
            this._canvas2DAssetMap = this._parser.parseAssets(rootNode, SLTBoard.BOARD_TYPE_CANVAS_2D);
        }
        catch (e) {
            throw new Error("[SALTR: ERROR] Level content asset parsing failed.")
        }

        try {
            this._matrixBoards = this._parser.parseBoardContent(rootNode, this._matrixAssetMap, SLTBoard.BOARD_TYPE_MATCHING);
            this._canvas2DBoards = this._parser.parseBoardContent(rootNode, this._canvas2DAssetMap, SLTBoard.BOARD_TYPE_CANVAS_2D);
        }
        catch (e) {
            throw new Error("[SALTR: ERROR] Level content boards parsing failed.")
        }

        this.regenerateAllBoards();
        this._contentReady = true;
    }

    /**
     * Regenerates contents of all boards.
     */
    public regenerateAllBoards(): void {
        if (null != this._matrixBoards) {
            for (let matrixBoardToken in this._matrixBoards) {
                this.regenerateBoard(SLTBoard.BOARD_TYPE_MATCHING, matrixBoardToken);
            }
        }
        if (null != this._canvas2DBoards) {
            for (let canvasBoardToken in this._canvas2DBoards) {
                this.regenerateBoard(SLTBoard.BOARD_TYPE_CANVAS_2D, canvasBoardToken);
            }
        }
    }

    /**
     * Regenerates content of the board by identifier.
     * @param boardType The board type.
     * @param boardToken The board token.
     */
    public regenerateBoard(boardType: string, boardToken: string): void {
        let board: SLTBoard = this.getBoard(boardType, boardToken);
        if (null != board) {
            board.regenerate();
        }
    }

    public getBoard(boardType: string, boardToken: string): SLTBoard {
        if (boardType == SLTBoard.BOARD_TYPE_MATCHING) {
            return this.getMatrixBoard(boardToken);
        }
        if (boardType == SLTBoard.BOARD_TYPE_CANVAS_2D) {
            return this.getCanvas2DBoard(boardToken);
        }
        return null;
    }
}

export {SLTLevel}