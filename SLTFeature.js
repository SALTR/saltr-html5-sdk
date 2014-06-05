(function (window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.Feature = function (token, properties, required) {
        this._token = token;
        this._properties = properties || {};
        this._required = required || false;
    };

    SALTR.Utils.extend(SALTR.Feature.prototype, {

        token: function (token) {
	        if (typeof token != "undefined") {
		        this._token = token;
	        }
            return this._token;
        },

        properties: function (properties) {
	        if (typeof properties != "undefined") {
		        this._properties = properties;
	        }
            return this._properties;
        },

        required: function (required) {
            if (typeof required != "undefined") {
                this._required = required;
            }
            return this._required;
        }

    });
})(window);