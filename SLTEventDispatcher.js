(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.EventDispatcher = function() {
		this._listeners = {};
	};

	SALTR.EventDispatcher.prototype = {
		addEventListener: function( eventType, callback ) {
			this._listeners[eventType] = this._listeners[eventType] || [];
			this._listeners[eventType].push( callback );
		},

		removeEventListener: function( eventType, callback ) {
			if ( this._listeners[eventType] ) {
				var listeners = this._listeners[eventType];
				if ( callback ) {
					for (var i = 0, l = listeners.length; i < l; i++) {
						if ( listeners[i] === callback ) {
							listeners.splice( i, 1 );
							this._listeners[eventType] = listeners;
							return true;
						}
					}
				}
				else {
					listeners = [];
					this._listeners[eventType] = listeners;
					delete this._listeners[eventType];
					return true;
				}
			}
			return false;
		},

		dispatchEvent: function( eventType ) {
			var listeners = this._listeners[eventType];
			if ( listeners ) {
				for (var i = 0, l = listeners.length; i < l; i++) {
					listeners[i].apply( this, arguments );
				}
			}
		}
	};
})(window);


