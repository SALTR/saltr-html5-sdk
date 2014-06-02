(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.TimerEvent = {
		TIMER_COMPLETE: "TIMER_COMPLETE"
	};

	SALTR.Timer = function(endTime) {
		this._endTime = endTime;
		this._currentTime = 0;

		this._interval = 1000;
		this._timerId = null;
	};

	SALTR.Timer.prototype = new SALTR.EventDispatcher();

	SALTR.Utils.extend(SALTR.Timer.prototype, {
		start: function() {
			var self = this;

			self._timerId = setInterval(function() {
				self._currentTime += self._interval;

				if ( self._currentTime >= self._endTime ) {
					self.complete();
				}
			}, self._interval);
		},

		complete: function() {
			this.stop();
			this.dispatchEvent(SALTR.TimerEvent.TIMER_COMPLETE);
		},

		stop: function() {
			clearInterval( this._timerId );
		}
	});
})(window);
