(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.Saltr = function(instanceKey) {
        SALTR.EventDispatcher.apply(this);

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

        initPartner: function(partnerId, partnerType) {
            this._partner = new SALTR.Partner(partnerId, partnerType);
        },

		initDevice: function(deviceId, deviceType) {
			this._device = new SALTR.Device(deviceId, deviceType);
		},

        importLevelPacksFromJSON: function(applicationJsonData) {
            var applicationData = JSON.parse(applicationJsonData);
            this._levelPacks = SALTR.Deserialize.decodeLevels(applicationData);
        },

        importLevelFromJSON: function(levelJsonData, level) {
             var levelData = JSON.parse(levelJsonData);
             level.updateContent(levelData);
         },

        defineFeature: function(token, properties) {
            var feature = this._features[token];

            if (!feature) {
                this._features[token] = new SALTR.Feature(token, null, properties);
            }
            else {
                feature.defaultProperties = properties;
            }
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
                resource.dispose();
                self.appDataAssetLoadCompleteHandler(jsonData);
            });
			resource.addEventListener(SALTR.ResourceEvent.ERROR, function(event, error) {
                resource.dispose();
                self.appDataAssetLoadErrorHandler(error);
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
				args.partner = this._partner.getData();;
			}
			args.instanceKey = this._instanceKey;

			urlVars.arguments = JSON.stringify(args);

			var ticket = new SALTR.ResourceTicket(SALTR.Config.SALTR_API_URL, SALTR.Utils.serializeURLVariables(urlVars));
			return new SALTR.Resource("saltAppConfig", ticket);
		},

        addUserProperty: function(propertyNames, propertyValues, operations) {
            var properties = [],
                args = {},
                urlVars = {},
                ticket = null,
                resource = null;

            for (var i = 0; i < propertyNames.length; i++) {
                properties.push({
                    key: propertyNames[i],
                    value: propertyValues[i],
                    operation: operations[i]
                });
            }

            args.saltId = this._saltrUserId;
            args.properties = properties;
            args.instanceKey = this._instanceKey;

            urlVars.command = SALTR.Config.COMMAND_ADD_PROPERTY;
            urlVars.arguments = JSON.stringify(args);

            ticket = new SALTR.ResourceTicket(SALTR.Config.SALTR_API_URL, urlVars);
            resource = new SALTR.Resource("userProperty", ticket);
            resource.addEventListener(SALTR.ResourceEvent.COMPLETE, function(event, jsonData) {
                resource.dispose();
                this.addUserPropertyCompleteHandler(jsonData);
            });
            resource.addEventListener(SALTR.ResourceEvent.ERROR, function(event, error) {
                resource.dispose();
                this.addUserPropertyErrorHandler(error);
            });
            resource.load();
        },

        addUserPropertyCompleteHandler: function (jsonData) {
        },

        addUserPropertyErrorHandler: function (error) {
        },

		appDataAssetLoadCompleteHandler: function(jsonData) {
            var token,
                saltrFeatures,
                saltrFeature,
                defaultFeature;

			jsonData = jsonData.responseData;

			this._isLoading = false;
			this._connected = true;

			this._saltrUserId = jsonData.saltId || jsonData.saltrUserId;

			this._experiments = SALTR.Deserialize.decodeExperiments(jsonData);
            saltrFeatures = SALTR.Deserialize.decodeFeatures(jsonData);
			this._levelPacks = SALTR.Deserialize.decodeLevels(jsonData);

            for (token in saltrFeatures) {
                if (saltrFeatures.hasOwnProperty(token)) {
                    saltrFeature = saltrFeatures[token];
                    defaultFeature = this._features[token];
                    if (defaultFeature) {
                        saltrFeature.defaultProperties = defaultFeature.defaultProperties;
                    }
                    this._features[token] = saltrFeature;
                }
            }

			this._onAppDataLoadSuccess();

            if ( this._isInDevMode ) {
                this.syncFeatures();
            }
		},

		appDataAssetLoadErrorHandler: function(error) {
			this._onAppDataLoadFail(error);
		},

        syncFeatures: function() {
             var urlVars = {},
                 features = this._features,
                 feature,
                 featureList = [],
                 ticket,
                 resource;

             urlVars.command = SALTR.Config.COMMAND_SAVE_OR_UPDATE_FEATURE;
             urlVars.instanceKey = this._instanceKey;

             if (this._appVersion) {
                urlVars.appVersion = this._appVersion;
             }

             for (var token in features) {
                 if (features.hasOwnProperty(token)) {
                     feature = features[token];
                     if (feature.defaultProperties) {
                         featureList.push({
                             token: feature.token,
                             value: JSON.stringify(feature.defaultProperties)
                         });
                     }
                 }
             }
             urlVars.data = JSON.stringify(featureList);

             ticket = new SALTR.ResourceTicket(SALTR.Config.SALTR_URL, urlVars);
             resource = new SALTR.Resource("saveOrUpdateFeature", ticket);
             resource.addEventListener(SALTR.ResourceEvent.COMPLETE, function (event, jsonData) {
                 resource.dispose();
                 this.featureSyncCompleteHandler(jsonData);
             });
             resource.addEventListener(SALTR.ResourceEvent.ERROR, function (event, error) {
                 resource.dispose();
                 this.featureSyncErrorHandler(error);
             });

             resource.load();
         },

        featureSyncCompleteHandler: function (jsonData) {
        },

        featureSyncErrorHandler: function (error) {
        },

		loadLevelContentData: function(level, levelLoadCompleteHandler, levelLoadFailedHandler) {
			var self = this;

			this._onLevelLoadSuccess = levelLoadCompleteHandler;
			this._onLevelLoadFail = levelLoadFailedHandler;

			var ticket = new SALTR.ResourceTicket(/*level._contentDataUrl*/ "level.php");
			var resource = new SALTR.Resource("loadLevel", ticket);
			resource.addEventListener(SALTR.ResourceEvent.COMPLETE, function(event, jsonData) {
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
			level.updateContent(jsonData);
			this._onLevelLoadSuccess();
		},

		levelLoadFailedHandler: function(error) {
			console.error(error);
			this._onLevelLoadFail();
		}

	});
})(window);
