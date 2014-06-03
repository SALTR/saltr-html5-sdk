(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.LevelSettings = function(assetMap, keySetMap, stateMap) {
		this._assetMap = assetMap;
		this._keySetMap = keySetMap;
		this._stateMap = stateMap;
	};

	SALTR.Utils.extend(SALTR.LevelSettings.prototype, {
		assetMap: function(assetMap) {
			if (typeof assetMap != "undefined") {
				this._assetMap = assetMap;
			}
			return this._assetMap;
		},

		keySetMap: function(keySetMap) {
			if (typeof keySetMap != "undefined") {
				this._keySetMap = keySetMap;
			}
			return this._keySetMap;
		},

		stateMap: function(stateMap) {
			if (typeof stateMap != "undefined") {
				this._stateMap = stateMap;
			}
			return this._stateMap;
		}
	});

})(window);
