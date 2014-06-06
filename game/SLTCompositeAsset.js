(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.CompositeAsset = function(cellInfos, token, properties) {
		SALTR.Asset.apply(this, [token, properties]);

		this.cellInfos = cellInfos || [];
	};

	SALTR.CompositeAsset.prototype = new SALTR.Asset;

	SALTR.Utils.extend(SALTR.CompositeAsset.prototype, {
	});
})(window);