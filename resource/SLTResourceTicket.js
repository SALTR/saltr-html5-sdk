(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.ResourceTicket = function (url, variables) {
		this.url = url;
		this.variables = variables;
		this.method = SALTR.Config.RequestMethod.GET;
		this.contentType = "JSON";

		this.dropTimeout = 0;
	};

	SALTR.Utils.extend(SALTR.ResourceTicket.prototype, {
		getURLRequest: function() {
			var request = {};
			request.url = this.url;
			request.data = this.variables;
			request.method = this.method;
			request.contentType = this.contentType;
			return request;
		},

		setDropTimeout: function(dropTimeout) {
			this.dropTimeout = dropTimeout;
		}
	});
})(window);