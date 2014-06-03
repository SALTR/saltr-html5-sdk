(function (window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.Feature = function (token, properties, defaultProperties) {
        this._token = token;
        this._properties = properties;
        this._defaultProperties = defaultProperties;
    };

    SALTR.Utils.extend(SALTR.Feature.prototype, {
        getProperties: function () {
            return this._properties || this._defaultProperties;
        }
    });
})(window);