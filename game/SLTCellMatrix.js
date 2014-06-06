(function(window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.CellMatrix = function(width, height) {
        this.width = width;
        this.height = height;
        this.rawData = [];
        this.iterator = null;
    };

    SALTR.Utils.extend(SALTR.CellMatrix.prototype, {
        getIterator: function () {
            if (!this.iterator) {
                this.iterator = new SALTR.CellMatrixIterator(this);
            }
            return this.iterator;
        },

        insert: function (col, row, cell) {
            this.rawData[row * this.width + col] = cell;
        },

        retrieve: function (col, row) {
            return this.rawData[row * this.width + col];
        }
    });
})(window);
