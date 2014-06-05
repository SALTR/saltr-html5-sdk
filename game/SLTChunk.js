(function (window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.Chunk = function(layer, chunkCells, chunkAssetRules, levelSettings) {
        this._layer = layer;
        this._chunkCells = chunkCells;
        this._chunkAssetRules = chunkAssetRules;

        this._availableCells = [];
        this._assetMap = levelSettings.assetsMap;
        this._stateMap = levelSettings.statesMap;

        this.generateCellContrent()
    };

    SALTR.Utils.extend(SALTR.Chunk.prototype, {
        generateCellContrent: function () {
            this._availableCells = this._chunkCells.concat();

            var countChunkAssetRules = [];
            var ratioChunkAssetRules = [];
            var randomChunkAssetRules = [];

            for (var i = 0; i < this._chunkAssetRules.length; i++) {
                var assetRule = this._chunkAssetRules[i];
                switch (assetRule.distributionType) {
                    case "count":
                        countChunkAssetRules.push(assetRule);
                        break;

                    case "ratio":
                        ratioChunkAssetRules.push(assetRule);
                        break;

                    case "random":
                        randomChunkAssetRules.push(assetRule);
                        break;
                }
            }

            if (countChunkAssetRules.length > 0) {
                this.generateAssetInstancesByCount(countChunkAssetRules);
            }
            if (ratioChunkAssetRules.length > 0) {
                this.generateAssetInstancesByRatio(ratioChunkAssetRules);
            }
            else if (randomChunkAssetRules.length > 0) {
                this.generateAssetInstancesRandomly(randomChunkAssetRules);
            }
        },

        generateAssetInstances: function (count, assetId, stateId) {
            var asset = this._assetMap[assetId];
            var state = this._stateMap[stateId];

            var randCell;
            var randCellIndex;

            for (var i = 0; i < count; i++) {
                randCellIndex = Math.round(Math.random() * this._availableCells.length - 1);
                randCell = this._availableCells[randCellIndex];
                randCell.setAssetInstance(this._layer.layerId, this._layer.layerIndex, new SLTAssetInstance(asset.token, state, asset.properties));

                this._availableCells.splice(randCellIndex, 1);
                if (this._availableCells.length == 0) {
                    return;
                }
            }
        },

        generateAssetInstancesByCount: function (countChunkAssetRules) {
            for (var i = 0; i < countChunkAssetRules.length; i++) {
                var assetRule = countChunkAssetRules[i];
                this.generateAssetInstances(assetRule.distributionValue, assetRule.assetId, assetRule.stateId);
            }
        },

        generateAssetInstancesByRatio: function (ratioChunkAssetRules) {
            var ratioSum = 0;
            var len = ratioChunkAssetRules.length;
            var assetRule;

            for (var i = 0; i < len; ++i) {
                assetRule = ratioChunkAssetRules[i];
                ratioSum += assetRule.distributionValue;
            }

            var availableCellsNum = this._availableCells.length;
            var proportion;
            var count;

            var fractionAssets = [];
            if (ratioSum != 0) {
                for (var j = 0; j < len; j++) {
                    assetRule = ratioChunkAssetRules[j];
                    proportion = assetRule.distributionValue / ratioSum * availableCellsNum;
                    count = proportion; //assigning number to int to floor the value;
                    fractionAssets.push({fraction: proportion - count, assetRule: assetRule});
                    this.generateAssetInstances(count, assetRule.assetId, assetRule.stateId);
                }

                fractionAssets.sortOn("fraction", Array.DESCENDING);
                availableCellsNum = _availableCells.length;

                for (var k = 0; k < availableCellsNum; k++) {
                    this.generateAssetInstances(1, fractionAssets[k].assetRule.assetId, fractionAssets[k].assetRule.stateId);
                }
            }
        },

        generateAssetInstancesRandomly: function (randomChunkAssetRules) {
            var len = randomChunkAssetRules.length;
            var availableCellsNum = this._availableCells.length;
            if (len > 0) {
                var assetConcentration = availableCellsNum > len ? availableCellsNum / len : 1;
                var minAssetCount = assetConcentration <= 2 ? 1 : assetConcentration - 2;
                var maxAssetCount = assetConcentration == 1 ? 1 : assetConcentration + 2;
                var lastChunkAssetIndex = len - 1;

                var chunkAssetRule;
                var count;
                for (var i = 0; i < len && _availableCells.length > 0; i++) {
                    chunkAssetRule = randomChunkAssetRules[i];
                    count = i == lastChunkAssetIndex ? this._availableCells.length : SALTR.Utils.randomWithin(minAssetCount, maxAssetCount);
                    this.generateAssetInstances(count, chunkAssetRule.assetId, chunkAssetRule.stateId);
                }
            }
        }
    });
})(window);
