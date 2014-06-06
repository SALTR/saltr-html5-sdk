(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

    var parseLayer = function(layer, cells, levelSettings) {
        parseFixedAssets(layer, cells, levelSettings);
        parseChunks(layer, cells, levelSettings);
        parseComposites(layer, cells, levelSettings);
    };

    var initializeCells = function(cells, boardNode) {
        var cellsProperties = boardNode.properties && boardNode.properties.cell ? boardNode.properties.cell : [],
            cellProperties,
            blockedCells = boardNode.blockedCells ? boardNode.blockedCells : [],
            blockedCell,
            cols = cells.width,
            rows = cells.height,
            cell;

        for (var i = 0, iLength; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                cells.insert(i, j, new SALTR.Cell(i, j));
            }
        }

        for (i = 0, iLength = cellsProperties.length; i < iLength; i++) {
            cellProperties = cellsProperties[i];
            cell = cells.retrieve(cellProperties.coords[0], cellProperties.coords[1]);
            if (cell != null) {
                cell.properties = cellProperties.value;
            }
        }

        for (i = 0, iLength < blockedCells.length; i < iLength; i++) {
            blockedCell = blockedCells[i];
            cell = cells.retrieve(blockedCell[0], blockedCell[1]);
            if (cell != null) {
                cell.isBlocked = true;
            }
        }
    };

    var parseFixedAssets = function(layer, cells, levelSettings) {
        var fixedAssetsNodes = layer.fixedAssetsNodes,
            fixedAsset,
            assetMap = levelSettings.assetMap,
            stateMap = levelSettings.stateMap,
            asset,
            state,
            cellPositions,
            cellPosition,
            cell;

        for (var i = 0, iLength = fixedAssetsNodes.length; i < iLength; i++) {
            fixedAsset = fixedAssetsNodes[i];
            asset = assetMap[fixedAsset.assetId];
            state = stateMap[fixedAsset.stateId];
            cellPositions = fixedAsset.cells;

            for (var j = 0, jLength = cellPositions.length; j < jLength; j++) {
                cellPosition = cellPositions[j];
                cell = cells.retrieve(cellPosition[0], cellPosition[1]);
                cell.setAssetInstance(layer.layerId, layer.layerIndex, new SALTR.AssetInstance(asset.token, state, asset.properties));
            }
        }
    };

    var parseChunks = function (layer, cellMatrix, levelSettings) {
        var chunkNodes = layer.chunkNodes,
            chunkNode,
            cellNodes,
            cellNode,
            chunkCells,
            assetNodes,
            assetNode,
            chunkAssetRules;

        for (var i = 0, iLength = chunkNodes.length; i < iLength; i++) {
            chunkNode = chunkNodes[i];
            cellNodes = chunkNode.cells;
            chunkCells = [];

            for (var j = 0, jLength = cellNodes.length; j < jLength; j++) {
                cellNode = cellNodes[j];
                chunkCells.push(cellMatrix.retrieve(cellNode[0], cellNode[1]));
            }

            assetNodes = chunkNode.assets;
            chunkAssetRules = [];

            for (j = 0, jLength = assetNodes.length; j < jLength; j++) {
                assetNode = assetNodes[j];
                chunkAssetRules.push(new SALTR.ChunkAssetRule(assetNode.assetId, assetNode.distributionType, assetNode.distributionValue, assetNode.stateId));
            }

            new SALTR.Chunk(layer, chunkCells, chunkAssetRules, levelSettings);
        }
    };

    var parseComposites = function(layer, cellMatrix, levelSettings) {
        var compositeNodes = layer.compositeNodes,
            compositeNode,
            cellPosition;

        for (var i = 0, iLength = compositeNodes.length; i < iLength; i++) {
            compositeNode = compositeNodes[i];
            cellPosition = compositeNode.cell;
            new SALTR.Composite(layer, compositeNode.assetId, compositeNode.stateId, cellMatrix.retrieve(cellPosition[0], cellPosition[1]), levelSettings);
        }
    };

	var parseBoardAssets = function(assetNodes) {
		var assets = {};
		for (var assetId in assetNodes) {
			if (assetNodes.hasOwnProperty(assetId)) {
                assets[assetId] = parseAsset(assetNodes[assetId]);
			}
		}
		return assets;
	};

	var parseAsset = function(assetNode) {
        var token = assetNode.token || assetNode.type,
            cellInfos = assetNode.cellInfos || assetNode.cells,
            properties = assetNode.properties;

        if (cellInfos) {
            return new SALTR.CompositeAsset(token, cellInfos, properties);
        }

        return new SALTR.Asset(token, properties);
	};

	var parseAssetStates = function(stateNodes) {
		var states = {};
		for (var stateId in stateNodes) {
			if (stateNodes.hasOwnProperty(stateId)) {
				states[stateId] = stateNodes[stateId];
			}
		}
		return states;
	};

	SALTR.LevelBoardParser = {
        parseLevelBoards: function(boardNodes, levelSettings) {
            var boardNode,
                boards = {};

            for (var boardId in boardNodes) {
                if (boardNodes.hasOwnProperty(boardId)) {
                    boardNode = boardNodes[boardId];
                    boards[boardId] = this.parseLevelBoard(boardNode, levelSettings);
                }
            }

            return boards;
        },

        parseLevelBoard: function(boardNode, levelSettings) {
            var boardProperties = {},
                cells = new SALTR.CellMatrix(boardNode.cols, boardNode.rows),
                layers = {},
                layerNodes = boardNode.layers,
                layerNode,
                layer;

            if (boardNode.properties && boardNode.properties.board) {
                boardProperties = boardNode.properties.board;
            }

            initializeCells(cells, boardNode);

            for (var i = 0, iLength = layerNodes.length; i < iLength; i++) {
                layerNode = layerNodes[i];
                layer = new SALTR.LevelBoardLayer(layerNode.layerId, i, layerNode.fixedAssets, layerNode.chunks, layerNode.composites);
                parseLayer(layer, cells, levelSettings);
                layers[layer.layerId] = layer.layerIndex;
            }

            return new SALTR.LevelBoard(cells, layers, boardProperties);
        },

		parseLevelSettings: function(rootNode) {
			return new SALTR.LevelSettings(parseBoardAssets(rootNode.assets), parseAssetStates(rootNode.assetStates));
		}
	};
})(window);
