(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.AssetInstance = function(token, state, properties) {
		this.token = token;
		this.state = state || "";
		this.properties = properties || null;
	};

	SALTR.Utils.extend(SALTR.AssetInstance.prototype, {
	});
})(window);
