(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.LevelPack = function(token, index, levels) {
		this._token = token;
		this._index = index;
		this._levels = levels;
	};

	SALTR.Utils.extend(SALTR.LevelPack.prototype, {
		token: function(token) {
			if (typeof token != "undefined") {
				this._token = token;
			}
			return this._token;
		},

		index: function(index) {
			if (typeof index != "undefined") {
				this._index = index;
			}
			return this._index;
		},

		levels: function(levels) {
			if (typeof levels != "undefined") {
				this._levels = levels;
			}
			return this._levels;
		}
	});
})(window);
