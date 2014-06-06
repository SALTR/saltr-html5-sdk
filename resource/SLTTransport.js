(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.TransportEvent = {
		COMPLETE: "COMPLETE",
		ERROR: "ERROR"
	};

	SALTR.Transport = function(request) {
        SALTR.EventDispatcher.apply(this);

		var self = this;

		this.request = request;

		this.xhr = new XMLHttpRequest();

		if (!"withCredentials" in this.xhr) {
			this.xhr = new XDomainRequest();
		}

		this.xhr.onload = function() {
			self.dispatchEvent(SALTR.TransportEvent.COMPLETE, self.xhr.responseText);
		};

		this.xhr.onerror = function() {
			self.dispatchEvent(SALTR.TransportEvent.ERROR);
		};
	};

	SALTR.Transport.prototype = new SALTR.EventDispatcher();

	SALTR.Utils.extend(SALTR.Transport.prototype, {

		load: function() {
			var url = this.request.url;

			if (this.request.method == SALTR.Config.RequestMethod.GET) {
				if (this.request.data) {
					url += "?" + this.request.data;
				}
				//TODO:ggor remove proxy.php
				this.xhr.open(this.request.method, "proxy.php?url=" + encodeURIComponent(url), true);
				this.xhr.send();
			}
			else if (this.request.method == SALTR.Config.RequestMethod.POST) {
				this.xhr.open(this.request.method, url, true);
				this.xhr.send(this.request.data ? this.request.data : null);
			}
		},

		close: function() {
			this.xhr.abort();
		}

	});

})(window);
