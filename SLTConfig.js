(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.Config = {
		CMD_APP_DATA: "APPDATA",
		COMMAND_ADD_PROPERTY: "ADDPROP",
		COMMAND_SAVE_OR_UPDATE_FEATURE: "syncFeatures",
	
		SALTR_API_URL: "http://localapi.saltr.com:8081/call",
//		SALTR_API_URL: "https://api.saltr.com/httpjson.action",
		SALTR_URL: "http://localadmin.saltr.com:8085/call",
	
		APP_DATA_URL_CACHE: "app_data_cache.json",
		LEVEL_PACK_URL_PACKAGE: "saltr/level_packs.json",
		LEVEL_CONTENT_DATA_URL_PACKAGE_TEMPLATE: "saltr/pack_{0}/level_{1}.json",
		LEVEL_CONTENT_DATA_URL_CACHE_TEMPLATE: "pack_{0}_level_{1}.json",
	
		PROPERTY_OPERATIONS_INCREMENT: "inc",
		PROPERTY_OPERATIONS_SET: "set",
	
		RESULT_SUCCEED: "SUCCEED",
		RESULT_ERROR: "ERROR",
	
		RequestMethod: {
			POST: "POST",
			GET: "GET",
			PUT: "PUT",
			DELETE: "DELETE"
		}
	};
})(window);
