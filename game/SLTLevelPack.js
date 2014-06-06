(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.LevelPack = function(token, index, levels) {
		this.token = token;
		this.index = index;
		this.levels = levels;
	};

	SALTR.Utils.extend(SALTR.LevelPack.prototype, {
	});
})(window);
