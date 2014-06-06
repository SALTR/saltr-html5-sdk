(function (window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.Chunk = function(layer, chunkCells, chunkAssetRules, levelSettings) {
        this.layer = layer;

        this.chunkCells = chunkCells;
        this.chunkAssetRules = chunkAssetRules;
        this.assetMap = levelSettings.assetMap;
        this.stateMap = levelSettings.stateMap;

        this.generateCellContent()
    };

    SALTR.Utils.extend(SALTR.Chunk.prototype, {
        generateCellContent: function () {
            var availableCells = this.chunkCells.concat(),
                assetRules = {
                    count: [],
                    ratio: [],
                    random: []
                },
                assetRule,
                assetDistributionType;

            for (var i = 0, iLength = this.chunkAssetRules.length; i < iLength; i++) {
                assetRule = this.chunkAssetRules[i];
                assetDistributionType = assetRule.distributionType;
                assetRules[assetDistributionType] && assetRules[assetDistributionType].push(assetRule);
            }

            if (assetRules.count.length > 0) {
                this.generateAssetInstancesByCount(assetRules.count, availableCells);
            }
            if (assetRules.ratio.length > 0) {
                this.generateAssetInstancesByRatio(assetRules.ratio, availableCells);
            }
            else if (assetRules.random.length > 0) {
                this.generateAssetInstancesRandomly(assetRules.random, availableCells);
            }
        },

        generateAssetInstancesByCount: function (countAssetRules, availableCells) {
            for (var i = 0, iLength = countAssetRules.length; i < iLength; i++) {
                var assetRule = countAssetRules[i];
                this.generateAssetInstances(assetRule.distributionValue, assetRule.assetId, assetRule.stateId, availableCells);
            }
        },

        generateAssetInstancesByRatio: function (ratioAssetRules, availableCells) {
            var availableCellsNum = availableCells.length,
                assetRule,
                ratioSum = 0,
                proportion;

            for (var i = 0, iLength = ratioAssetRules.length; i < iLength; i++) {
                assetRule = ratioAssetRules[i];
                ratioSum += assetRule.distributionValue;
            }

            var fractionAssets = [];
            if (ratioSum != 0) {
                for (var j = 0, jLength = ratioAssetRules.length; j < jLength; j++) {
                    assetRule = ratioAssetRules[j];
                    proportion = assetRule.distributionValue / ratioSum * availableCellsNum;
                    fractionAssets.push({fraction: proportion % 1, assetRule: assetRule});
                    this.generateAssetInstances(Math.floor(proportion), assetRule.assetId, assetRule.stateId, availableCells);
                }
                fractionAssets.sort( function (a, b) { return b.fraction - a.fraction } );

                for (j = 0, jLength = availableCells.length; j < jLength; j++) {
                    this.generateAssetInstances(1, fractionAssets[j].assetRule.assetId, fractionAssets[j].assetRule.stateId, availableCells);
                }
            }
        },

        generateAssetInstancesRandomly: function (randomAssetRules, availableCells) {
            var assetsCount = randomAssetRules.length,
                availableCellsNum = availableCells.length;

            if (assetsCount > 0) {
                var assetConcentration = availableCellsNum > assetsCount ? availableCellsNum / assetsCount : 1,
                    minAssetCount = assetConcentration <= 2 ? 1 : assetConcentration - 2,
                    maxAssetCount = assetConcentration == 1 ? 1 : assetConcentration + 2,
                    assetRule,
                    count;

                for (var i = 0; i < assetsCount && availableCells.length > 0; i++) {
                    assetRule = randomAssetRules[i];
                    count = i == assetsCount - 1 ? availableCells.length : SALTR.Utils.randomWithin(minAssetCount, maxAssetCount);
                    this.generateAssetInstances(count, assetRule.assetId, assetRule.stateId, availableCells);
                }
            }
        },

        generateAssetInstances: function (count, assetId, stateId, availableCells) {
            var asset = this.assetMap[assetId],
                state = this.stateMap[stateId],
                randCellIndex,
                randCell;

            for (var i = 0; i < count; i++) {
                randCellIndex = Math.round(Math.random() * (availableCells.length - 1));
                randCell = availableCells[randCellIndex];
                randCell.setAssetInstance(this.layer.layerId, this.layer.layerIndex, new SALTR.AssetInstance(asset.token, state, asset.properties));

                availableCells.splice(randCellIndex, 1);
                if (availableCells.length == 0) {
                    return;
                }
            }
        }
    });
})(window);
