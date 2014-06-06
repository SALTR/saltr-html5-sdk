(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.Asset = function(type, keys) {
		this.type = type;
		this.keys = keys;
	};

	SALTR.Utils.extend(SALTR.Asset.prototype, {
	});
})(window);