(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.Partner = function (partnerId, partnerType) {
		this._partnerId = partnerId;
		this._partnerType = partnerType;
	};

	SALTR.Utils.extend(SALTR.Partner.prototype, {

		getData: function() {
			return {
                partnerId: this._partnerId,
                partnerType: this._partnerType
			};
		}

	});
})(window);
