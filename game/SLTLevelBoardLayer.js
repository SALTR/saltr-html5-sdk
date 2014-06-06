(function(window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.LevelBoardLayer = function(layerId, layerIndex, fixedAssetsNodes, chunkNodes, compositeNodes) {
        this.layerId = layerId;
        this.layerIndex = layerIndex;
        this.fixedAssetsNodes = fixedAssetsNodes || [];
        this.chunkNodes = chunkNodes || [];
        this.compositeNodes = compositeNodes || [];
    };

    SALTR.Utils.extend(SALTR.LevelBoardLayer.prototype, {
    });
})(window);
