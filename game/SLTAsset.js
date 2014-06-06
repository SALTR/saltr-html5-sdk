(function(window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.Asset = function(token, properties) {
        this.token = token;
        this.properties = properties;
    };

    SALTR.Utils.extend(SALTR.Asset.prototype, {
    });
})(window);