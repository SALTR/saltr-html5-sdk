(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.Experiment = function (token, partition, type, customEvents) {
		this._token = token;
		this._partition = partition;
		this._type = type;
		this._customEvents = customEvents;
	};

	SALTR.Utils.extend(SALTR.Feature.prototype, {

		token: function (token) {
			if (typeof token != "undefined") {
				this._token = token;
			}
			return this._token;
		},

		partition: function (partition) {
			if (typeof partition != "undefined") {
				this._partition = partition;
			}
			return this._partition;
		},

		type: function (type) {
			if (typeof type != "undefined") {
				this._type = type;
			}
			return this._type;
		},

		customEvents: function (customEvents) {
			if (typeof customEvents != "undefined") {
				this._customEvents = customEvents;
			}
			return this._customEvents;
		}

	});
})(window);