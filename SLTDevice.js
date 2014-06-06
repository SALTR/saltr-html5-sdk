(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.Device = function (deviceId, deviceType) {
		this.deviceId = deviceId;
		this.deviceType = deviceType;
	};

	SALTR.Utils.extend(SALTR.Device.prototype, {

		getDeviceData: function() {
			return {
				deviceId: this.deviceId,
				deviceType: this.deviceType
			};
		}

	});
})(window);
