(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.Partner = function (partnerId, partnerType) {
		this.partnerId = partnerId;
		this.partnerType = partnerType;
	};

	SALTR.Utils.extend(SALTR.Partner.prototype, {

		getPartnerData: function() {
			return {
                partnerId: this.partnerId,
                partnerType: this.partnerType
			};
		}

	});
})(window);