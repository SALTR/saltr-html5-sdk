(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.ResourceTicket = function (url, variables) {
		this._url = url;
		this._variables = variables;
		this._method = SALTR.Config.RequestMethod.GET;
		this._contentType = "JSON";

		this._dropTimeout = 0;
	};

	SALTR.Utils.extend(SALTR.ResourceTicket.prototype, {
		getURLRequest: function() {
			var request = {};
			request.url = this._url;
			request.data = this._variables;
			request.method = this._method;
			request.contentType = this._contentType;
			return request;
		},

		setDropTimeout: function(dropTimeout) {
			this._dropTimeout = dropTimeout;
		}
	});
})(window);