(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.Experiment = function (token, partition, type, customEvents) {
		this.token = token;
		this.partition = partition;
		this.type = type;
		this.customEvents = customEvents;
	};

	SALTR.Utils.extend(SALTR.Experiment.prototype, {
	});
})(window);