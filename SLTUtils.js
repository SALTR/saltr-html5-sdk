(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.Utils = {

		extend: function(destObject, sourceObject) {
			for (var prop in sourceObject) {
				if (sourceObject.hasOwnProperty(prop)) {
					destObject[prop] = sourceObject[prop];
				}
			}
			return destObject;
		},

		serializeURLVariables: function( urlVariables ) {
			var resultUrlVariables = [];

			for (var param in urlVariables) {
				if (urlVariables.hasOwnProperty(param)) {
					resultUrlVariables.push(param + "=" + urlVariables[param]);
				}
			}

			return resultUrlVariables.join("&");
		}

	};
})(window);

