(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.CompositeInstance = function(token, state, properties, cells) {
        SALTR.AssetInstance.apply(this, [token, state, properties]);

		this.cells = cells;
	};

	SALTR.CompositeInstance.prototype = new SALTR.AssetInstance;

	SALTR.Utils.extend(SALTR.CompositeAsset.prototype, {
	});
})(window);
