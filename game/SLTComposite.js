(function (window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.Composite = function(layer, compositeAssetId, stateId, cell, levelSettings) {
        this.layer = layer;

        this.assetId = compositeAssetId;
        this.stateId = stateId;
        this.cell = cell;
        this.assetMap = levelSettings.assetMap;
        this.stateMap = levelSettings.stateMap;

        this.generateCellContent();
    };

    SALTR.Utils.extend(SALTR.Composite.prototype, {
        generateCellContent: function () {
            var asset = this.assetMap[this.assetId],
                state = this.stateMap[this.stateId];
            this.cell.setAssetInstance(this.layer.layerId, this.layer.layerIndex, new SALTR.CompositeInstance(asset.token, state, asset.properties, asset.cellInfos));
        }
    });
})(window);
