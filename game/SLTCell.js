(function(window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.Cell = function(col, row) {
        this.col = col;
        this.row = row;
        this.properties = {};
        this.isBlocked = false;
        this.instanceByLayerId = {};
        this.instanceByLayerIndex = {};
    };

    SALTR.Utils.extend(SALTR.Cell.prototype, {
        getAssetInstanceByLayerId: function (layerId) {
            return this.instanceByLayerId[layerId];
        },

        getAssetInstanceByLayerIndex: function (layerIndex) {
            return this.instanceByLayerIndex[layerIndex];
        },

        setAssetInstance: function (layerId, layerIndex, assetInstance) {
            if (!this.isBlocked) {
                this.instanceByLayerId[layerId] = assetInstance;
                this.instanceByLayerIndex[layerIndex] = assetInstance;
            }
        }
    });
})(window);
