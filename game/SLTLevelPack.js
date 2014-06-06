(function(window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.LevelPack = function(token, index, levels) {
        this.token = token;
        this.levels = levels;
        this.index = index;
    };

    SALTR.Utils.extend(SALTR.LevelPack.prototype, {
    });
})(window);
