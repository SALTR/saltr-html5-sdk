(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.CompositeAsset = function(cellInfos, type, keys) {
		SALTR.Asset.apply(this, [type, keys]);

		this.cellInfos = cellInfos;
	};

	SALTR.CompositeAsset.prototype = new SALTR.Asset;

	SALTR.Utils.extend(SALTR.CompositeAsset.prototype, {
	});
})(window);