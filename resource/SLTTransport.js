(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.TransportEvent = {
		COMPLETE: "COMPLETE",
		ERROR: "ERROR"
	};

	SALTR.Transport = function(request) {
        SALTR.EventDispatcher.apply(this);

		var self = this;

		this._request = request;

		this._xhr = new XMLHttpRequest();

		if (!"withCredentials" in this._xhr) {
			this._xhr = new XDomainRequest();
		}

		this._xhr.onload = function() {
			var jsonData;
			if ( request.contentType == "JSON" ) {
				try {
					jsonData = JSON.parse(self._xhr.responseText);
					self.dispatchEvent(SALTR.TransportEvent.COMPLETE, jsonData);
				}
				catch (ex) {
					self.dispatchEvent(SALTR.TransportEvent.ERROR, "[JSONAsset] JSON parsing Error.");
				}
			}
		};

		this._xhr.onerror = function() {
			self.dispatchEvent(SALTR.TransportEvent.ERROR);
		};
	};

	SALTR.Transport.prototype = new SALTR.EventDispatcher();

	SALTR.Utils.extend(SALTR.Transport.prototype, {

		load: function() {
			var url = this._request.url;

			if (this._request.method == SALTR.Config.RequestMethod.GET) {
				if (this._request.data) {
					url += "?" + this._request.data;
				}
				//TODO:ggor remove proxy.php
				this._xhr.open(this._request.method, "proxy.php?url=" + encodeURIComponent(url), true);
				this._xhr.send();
			}
			else if (this._request.method == SALTR.Config.RequestMethod.POST) {
				this._xhr.open(this._request.method, url, true);
				this._xhr.send(this._request.data ? this._request.data : null);
			}
		},

		close: function() {
			this._xhr.abort();
		}

	});

})(window);
