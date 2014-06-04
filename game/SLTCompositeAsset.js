(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.CompositeAsset = function(cellInfos, type, keys) {
		SALTR.Asset.apply(this, [type, keys]);

		this._cellInfos = cellInfos;
	};

	SALTR.CompositeAsset.prototype = new SALTR.Asset;

	SALTR.Utils.extend(SALTR.CompositeAsset.prototype, {
		cellInfos: function(cellInfos) {
			if (typeof cellInfos != "undefined") {
				this._cellInfos = cellInfos;
			}
			return this._cellInfos;
		}
	});
})(window);