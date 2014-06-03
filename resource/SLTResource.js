(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.ResourceEvent = {
		COMPLETE: "COMPLETE",
		ERROR: "ERROR"
	};

	SALTR.Resource = function (id, ticket) {
        SALTR.EventDispatcher.apply(this);

		this._id = id;
		this._ticket = ticket;
		this._transport = null;

		this._dropTimeout = ticket._dropTimeout;
		this._timeoutTimer = null;

		this.initTransport();
	};

	SALTR.Resource.prototype = new SALTR.EventDispatcher();

	SALTR.Utils.extend(SALTR.Resource.prototype, {

		initTransport: function() {
			var request = this._ticket.getURLRequest();
			this._transport = new SALTR.Transport(request);
		},

		load: function() {
			this.initTransportListeners();
			this._transport.load();
			this.startDropTimeoutTimer();
		},

		stop: function() {
			this.removeTransportListeners();
			this._transport.close();
			this.stopDropTimeoutTimer();
		},

		dispose: function() {
            this.removeEventListener(SALTR.ResourceEvent.COMPLETE);
            this.removeEventListener(SALTR.ResourceEvent.ERROR);

			this._id = null;
			this._ticket = null;
			this._transport = null;
		},

		initTransportListeners: function() {
			var self = this;

			this._transport.addEventListener(SALTR.TransportEvent.COMPLETE, function(event, resource) {
				self.completeHandler(resource);
			});
			this._transport.addEventListener(SALTR.TransportEvent.ERROR, function(event, error) {
				self.errorHandler(error);
			});
		},

		removeTransportListeners: function() {
			this._transport.removeEventListener(SALTR.TransportEvent.COMPLETE);
			this._transport.removeEventListener(SALTR.TransportEvent.ERROR);
		},

		startDropTimeoutTimer: function() {
			var self = this;
			if ( self._dropTimeout != 0 ) {
				self._timeoutTimer = new SALTR.Timer(self._dropTimeout);
				self._timeoutTimer.addEventListener(SALTR.TimerEvent.TIMER_COMPLETE, function() {
					self.dropDropTimeoutTimer();
				});
				self._timeoutTimer.start();
			}
		},

		stopDropTimeoutTimer: function() {
			if ( this._dropTimeout != 0 ) {
				this._timeoutTimer.stop();
				this._timeoutTimer = null;
			}
		},

		dropDropTimeoutTimer: function() {
			if ( this._timeoutTimer ) {
				this._transport.close();
				this._timeoutTimer.removeEventListener(SALTR.TimerEvent.TIMER_COMPLETE);
				this._timeoutTimer = null;
				this.errorHandler("[Asset] Loading is too long, so it stopped by force.");
			}
		},

		completeHandler: function(resource) {
			this.stopDropTimeoutTimer();
			this.removeTransportListeners();
			this.dispatchEvent(SALTR.ResourceEvent.COMPLETE, resource);
		},

		errorHandler: function(error) {
			this.stopDropTimeoutTimer();
			this.removeTransportListeners();
			this.dispatchEvent(SALTR.ResourceEvent.ERROR, error);
		}

	});
})(window);

