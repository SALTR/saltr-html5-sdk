(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.Asset = function(type, keys) {
		this._type = type;
		this._keys = keys;
	};

	SALTR.Utils.extend(SALTR.Asset.prototype, {
		type: function(type) {
			if (typeof type != "undefined") {
				this._type = type;
			}
			return this._type;
		},

		keys: function(keys) {
			if (typeof keys != "undefined") {
				this._keys = keys;
			}
			return this._keys;
		}
	});
})(window);