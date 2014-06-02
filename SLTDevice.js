(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.Device = function (deviceId, deviceType) {
		this._deviceId = deviceId;
		this._deviceType = deviceType;
	};

	SALTR.Utils.extend(SALTR.Device.prototype, {

		getData: function() {
			return {
				deviceId: this._deviceId,
				deviceType: this._deviceType
			};
		}

	});
})(window);
