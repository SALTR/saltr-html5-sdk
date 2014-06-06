(function(window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.LevelBoard = function(cells, layers, properties) {
        this.cells = cells;
        this.cols = cells.width;
        this.rows = cells.height;
        this.properties = properties || {};
        this.layers = layers;
    };

    SALTR.Utils.extend(SALTR.LevelBoard.prototype, {
    });
})(window);
