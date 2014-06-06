(function (window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.ChunkAssetRule = function(assetId, distributionType,  distributionValue, stateId) {
        this.assetId = assetId;
        this.stateId = stateId;
        this.distributionType = distributionType;
        this.distributionValue = distributionValue;
    };

    SALTR.Utils.extend(SALTR.ChunkAssetRule.prototype, {
    });
})(window);
