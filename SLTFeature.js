(function (window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.Feature = function (token, properties, defaultProperties) {
        this._token = token;
        this._properties = properties;
        this._defaultProperties = defaultProperties;
    };

    SALTR.Utils.extend(SALTR.Feature.prototype, {

        token: function () {
            return this._token;
        },

        properties: function () {
            return this._properties || this._defaultProperties;
        },

        defaultProperties: function (defaultProperties) {
            if (typeof defaultProperties != "undefined") {
                this._defaultProperties = defaultProperties;
            }
            return this._defaultProperties;
        }

    });
})(window);