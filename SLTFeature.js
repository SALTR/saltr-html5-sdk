(function (window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.Feature = function (token, properties, required) {
        this.token = token;
        this.properties = properties || {};
        this.required = required || false;
    };

    SALTR.Utils.extend(SALTR.Feature.prototype, {
    });
})(window);