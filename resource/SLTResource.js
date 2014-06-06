(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.ResourceEvent = {
		COMPLETE: "COMPLETE",
		ERROR: "ERROR"
	};

	SALTR.Resource = function (id, ticket) {
        SALTR.EventDispatcher.apply(this);

		this.id = id;
		this.ticket = ticket;
		this.transport = null;

		this.dropTimeout = ticket.dropTimeout;
		this.timeoutTimer = null;

		this.jsonData = null;

		this.initTransport();
	};

	SALTR.Resource.prototype = new SALTR.EventDispatcher();

	SALTR.Utils.extend(SALTR.Resource.prototype, {

		initTransport: function() {
			var request = this.ticket.getURLRequest();
			this.transport = new SALTR.Transport(request);
		},

		load: function() {
			this.initTransportListeners();
			this.transport.load();
			this.startDropTimeoutTimer();
		},

		stop: function() {
			this.removeTransportListeners();
			this.transport.close();
			this.stopDropTimeoutTimer();
		},

		dispose: function() {
            this.removeEventListener(SALTR.ResourceEvent.COMPLETE);
            this.removeEventListener(SALTR.ResourceEvent.ERROR);

			this.id = null;
			this.ticket = null;
			this.transport = null;
		},

		getJsonData: function() {
			var jsonData = null;
			try {
				jsonData = JSON.parse(this.jsonData);
			}
			catch (ex) {
				throw new Error("[JSONAsset] JSON parsing Error. " + this.ticket.variables + " \n  " + data);
			}
			return jsonData;
		},

		initTransportListeners: function() {
			var self = this;

			this.transport.addEventListener(SALTR.TransportEvent.COMPLETE, function(event, resource) {
				self.completeHandler(resource);
			});
			this.transport.addEventListener(SALTR.TransportEvent.ERROR, function(event, error) {
				self.errorHandler(error);
			});
		},

		removeTransportListeners: function() {
			this.transport.removeEventListener(SALTR.TransportEvent.COMPLETE);
			this.transport.removeEventListener(SALTR.TransportEvent.ERROR);
		},

		startDropTimeoutTimer: function() {
			var self = this;
			if ( self.dropTimeout != 0 ) {
				self.timeoutTimer = new SALTR.Timer(self.dropTimeout);
				self.timeoutTimer.addEventListener(SALTR.TimerEvent.TIMER_COMPLETE, function() {
					self.dropDropTimeoutTimer();
				});
				self.timeoutTimer.start();
			}
		},

		stopDropTimeoutTimer: function() {
			if ( this.dropTimeout != 0 ) {
				this.timeoutTimer.stop();
				this.timeoutTimer = null;
			}
		},

		dropDropTimeoutTimer: function() {
			if ( this.timeoutTimer ) {
				this.transport.close();
				this.timeoutTimer.removeEventListener(SALTR.TimerEvent.TIMER_COMPLETE);
				this.timeoutTimer = null;
				this.errorHandler("[Asset] Loading is too long, so it stopped by force.");
			}
		},

		completeHandler: function(data) {
			this.stopDropTimeoutTimer();
			this.removeTransportListeners();
			this.jsonData = data;
			this.dispatchEvent(SALTR.ResourceEvent.COMPLETE, this);
		},

		errorHandler: function(error) {
			this.stopDropTimeoutTimer();
			this.removeTransportListeners();
			this.dispatchEvent(SALTR.ResourceEvent.ERROR, error);
		}

	});
})(window);

