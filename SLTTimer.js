(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.TimerEvent = {
		TIMER_COMPLETE: "TIMER_COMPLETE"
	};

	SALTR.Timer = function(endTime) {
        SALTR.EventDispatcher.apply(this);

		this.endTime = endTime;
		this.currentTime = 0;

		this.interval = 1000;
		this.timerId = null;
	};

	SALTR.Timer.prototype = new SALTR.EventDispatcher();

	SALTR.Utils.extend(SALTR.Timer.prototype, {
		start: function() {
			var self = this;

			self.timerId = setInterval(function() {
				self.currentTime += self.interval;

				if ( self.currentTime >= self.endTime ) {
					self.complete();
				}
			}, self.interval);
		},

		complete: function() {
			this.stop();
			this.dispatchEvent(SALTR.TimerEvent.TIMER_COMPLETE);
		},

		stop: function() {
			clearInterval( this.timerId );
		}
	});
})(window);