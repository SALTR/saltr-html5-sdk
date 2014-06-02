(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.Saltr = function(instanceKey) {
		this._experiments = [];
		this._features = {};
		this._levelPacks = [];

		this._saltrUserId = "";
		this._isLoading = false;
		this._connected = false;
		this._partner = null;

		this._instanceKey = instanceKey;
		this._device = null;
		this._onAppDataLoadSuccess = null;
		this._onAppDataLoadFail = null;
		this._onContentDataLoadSuccess = null;
		this._onContentDataFail = null;

		this._isInDevMode = true;
		this._appVersion = "";
	};

	window.SALTR = SALTR;

	SALTR.Saltr.prototype = new SALTR.EventDispatcher();

	SALTR.Utils.extend(SALTR.Saltr.prototype, {

		initDevice: function(deviceId, deviceType) {
			this._device = new SALTR.Device(deviceId, deviceType);
		},

		start: function(onDataLoadSuccess, onDataLoadFail) {
			var self = this;

			if (this._isLoading) {
				return;
			}
			this._onAppDataLoadSuccess = onDataLoadSuccess;
			this._onAppDataLoadFail = onDataLoadFail;

			this._isLoading = true;
			this._connected = false;

			var resource = this.createAppDataResource();
			resource.addEventListener(SALTR.ResourceEvent.COMPLETE, function(event, jsonData) {
				self.appDataAssetLoadCompleteHandler(jsonData);
				resource.dispose();
			});
			resource.addEventListener(SALTR.ResourceEvent.ERROR, function(event, error) {
				self.appDataAssetLoadErrorHandler(error);
				resource.dispose();
			});
			resource.load();
		},

		createAppDataResource: function() {
			var urlVars = {};
			urlVars.command = SALTR.Config.COMMAND_APP_DATA;

			var args = {};
			if (this._device != null) {
				args.device = this._device.getData();
			}
			if (this._partner != null) {
				args.partner = this._partner;
			}
			args.instanceKey = this._instanceKey;

			urlVars.arguments = JSON.stringify(args);

			var ticket = new SALTR.ResourceURLTicket(SALTR.Config.SALTR_API_URL, SALTR.Utils.serializeURLVariables(urlVars));
			return new SALTR.Resource("saltAppConfig", ticket);
		},

		appDataAssetLoadCompleteHandler: function(jsonData) {
			jsonData = jsonData.responseData;

			this._isLoading = false;
			this._connected = true;

			this._saltrUserId = jsonData.saltId || jsonData.saltrUserId;

			this._experiments = SALTR.Deserialize.decodeExperiments(jsonData);
			this._features = SALTR.Deserialize.decodeFeatures(jsonData);
			this._levelPacks = SALTR.Deserialize.decodeLevels(jsonData);

			this._onAppDataLoadSuccess();
		},

		appDataAssetLoadErrorHandler: function(error) {
			this._onAppDataLoadFail(error);
		},

		loadLevelContentData: function(level, levelLoadCompleteHandler, levelLoadFailedHandler) {
			var self = this;

			this._onLevelLoadSuccess = levelLoadCompleteHandler;
			this._onLevelLoadFail = levelLoadFailedHandler;

			var ticket = new SALTR.ResourceURLTicket(/*level._contentDataUrl*/ "level.php");
			var resource = new SALTR.Resource("loadLevel", ticket);
			resource.addEventListener(SALTR.ResourceEvent.COMPLETE, function(event, jsonData) {
				debugger;
				self.levelLoadCompleteHandler(level, jsonData);
				resource.dispose();
			});
			resource.addEventListener(SALTR.ResourceEvent.ERROR, function(event, error) {
				self.levelLoadFailedHandler(error);
				resource.dispose();
			});
			resource.load();
		},

		levelLoadCompleteHandler: function(level, jsonData) {
			debugger;
			level.updateContent(jsonData);
			this._onLevelLoadSuccess();
		},

		levelLoadFailedHandler: function(error) {
			console.error(error);
			this._onLevelLoadFail();
		}

	});
})(window);
