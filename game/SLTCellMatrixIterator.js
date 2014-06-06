(function(window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.CellMatrixIterator = function(cells) {
        this.cells = cells;
        this.vectorLength = 0;
        this.currentPosition = 0;

        this.reset();
    };

    SALTR.Utils.extend(SALTR.CellMatrixIterator.prototype, {
        hasNext: function () {
            return this.currentPosition != this.vectorLength;
        },

        next: function () {
            return this.cells.rawData[this.currentPosition++];
        },

        reset: function () {
            this.vectorLength = this.cells.rawData.length;
            this.currentPosition = 0;
        }
    });
})(window);
