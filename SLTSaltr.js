(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.SaltrWeb = function(clientKey) {
        SALTR.EventDispatcher.apply(this);

		this._socialId = null;
		this._socialNetwork = null;
		this._connected = false;
		this._clientKey = clientKey;
		this._saltrUserId = "";
		this._isLoading = false;

		this._activeFeatures = {};
		this._developerFeatures = {};

		this._experiments = [];
		this._levelPacks = [];

		this._appDataLoadSuccessCallback = null;
		this._appDataLoadFailCallback = null;
		this._levelContentLoadSuccessCallback = null;
		this._levelContentLoadFailCallback = null;

		this._requestIdleTimeout = 0;

		this._devMode = true;
		this._appVersion = "";
		this._started = false;
		this._useNoLevels = false;
		this._useNoFeatures = false;
	};

	SALTR.SaltrWeb.prototype = new SALTR.EventDispatcher();

	SALTR.Utils.extend(SALTR.SaltrWeb.prototype, {

		appVersion: function(appVersion) {
			if (typeof appVersion != "undefined") {
				this._appVersion = appVersion;
			}
			return this._appVersion;
		},

		connected: function(connected) {
			if (typeof connected != "undefined") {
				this._connected = connected;
			}
			return this._connected;
		},

		useNoLevels: function(useNoLevels) {
			if (typeof useNoLevels != "undefined") {
				this._useNoLevels = useNoLevels;
			}
			return this._useNoLevels;
		},

		useNoFeatures: function(useNoFeatures) {
			if (typeof useNoFeatures != "undefined") {
				this._useNoFeatures = useNoFeatures;
			}
			return this._useNoFeatures;
		},

		requestIdleTimeout: function(requestIdleTimeout) {
			if (typeof requestIdleTimeout != "undefined") {
				this._requestIdleTimeout = requestIdleTimeout;
			}
			return this._requestIdleTimeout;
		},

		levelPacks: function(levelPacks) {
			if (typeof levelPacks != "undefined") {
				this._levelPacks = levelPacks;
			}
			return this._levelPacks;
		},

		experiments: function(experiments) {
			if (typeof experiments != "undefined") {
				this._experiments = experiments;
			}
			return this._experiments;
		},

		setSocial: function(socialId, socialNetwork) {
			if (typeof socialId == "undefined" || typeof socialNetwork == "undefined") {
				throw new Error("Both variables - 'socialId' and 'socialNetwork' are required and should be non 'null'.");
			}

			this._socialId = socialId;
			this._socialNetwork = socialNetwork;
		},

		getActiveFeatureTokens: function() {
			var tokens = [],
				activeFeatures = this._activeFeatures;
			for (var x in activeFeatures) {
				if (activeFeatures.hasOwnProperty(x)) {
					tokens.push(activeFeatures[x].token());
				}
			}
			return tokens;
		},

		getFeatureProperties: function(token) {
			var activeFeature = this._activeFeatures[token],
				devFeature;
			if (typeof activeFeature != "undefined") {
				return activeFeature.properties();
			}
			else {
				devFeature = this._developerFeatures[token];
				if (typeof devFeature != "undefined" && devFeature.required) {
					return devFeature.properties();
				}
			}
			return null;
		},

		importLevelFromJSON: function(json, level) {
			var levelData = typeof json == "string" ? JSON.parse(json) : json;
			level.updateContent(levelData);
		},

		importLevelPacksFromJSON: function(json) {
            var applicationData = typeof json == "string" ? JSON.parse(json) : json;
            this._levelPacks = SALTR.Deserializer.decodeLevels(applicationData);
        },

		importDeveloperFeaturesFromJSON: function(json) {
			var featuresJSON = JSON.parse(json);
			this._developerFeatures = SALTR.Deserializer.decodeFeatures(featuresJSON);
		},

        defineFeature: function(token, properties, required) {
	        required = required || false;
	        if (this._started === false) {
		        this._developerFeatures[token] = new SALTR.Feature(token, properties, required);
	        }
            else {
		        throw new Error("Method 'defineFeature()' should be called before 'start()' only.");
            }
        },

		start: function() {
			if (this._socialId == null || this._socialNetwork == null) {
				throw new Error("'socialId' and 'socialNetwork' fields are required and can't be null.");
			}

			if (this._useNoFeatures == false && SALTR.Utils.getObjectSize(this._developerFeatures) == 0) {
				throw new Error("Features should be defined.");
			}

			if (this._useNoLevels == false && this._levelPacks.length == 0) {
				throw new Error("Levels should be imported.");
			}

			for (var i in this._developerFeatures) {
				if (this._developerFeatures.hasOwnProperty(i)) {
					this._activeFeatures[i] = this._developerFeatures[i];
				}
			}

			this._started = true;
		},

		connect: function(successCallback, failCallback) {
			var self = this,
				resource;

			if (this._isLoading || !this._started) {
				return;
			}

			this._appDataLoadSuccessCallback = successCallback;
			this._appDataLoadFailCallback = failCallback;

			this._isLoading = true;

			resource = this.createAppDataResource();
			resource.addEventListener(SALTR.ResourceEvent.COMPLETE, function(event, resource) {
				self.appDataAssetLoadCompleteHandler(resource);
            });
			resource.addEventListener(SALTR.ResourceEvent.ERROR, function(event, resource) {
                self.appDataAssetLoadErrorHandler(resource);
            });
			resource.load();
		},

		createAppDataResource: function() {
			var urlVars = {},
				args = {},
				ticket;

			urlVars.cmd = SALTR.Config.CMD_APP_DATA;
			if (this._socialId != null && this._socialNetwork != null) {
				args.socialId = this._socialId;
				args.socialNetwork = this._socialNetwork;
			}
			else {
				throw new Error("In SALTR for Web 'socialId' and 'socialNetwork' are required fields.");
			}

			args.clientKey = this._clientKey;
			urlVars.args = JSON.stringify(args);

			ticket = new SALTR.ResourceTicket(SALTR.Config.SALTR_API_URL, SALTR.Utils.serializeURLVariables(urlVars));
			return new SALTR.Resource("saltAppConfig", ticket);
		},

		appDataAssetLoadCompleteHandler: function(resource) {
			var data = resource.jsonData(),
				status = data.status,
				responseData = data.responseData;

			this._isLoading = false;

			if ( this._devMode ) {
				this.syncDeveloperFeatures();
			}

			if (status == SALTR.Config.RESULT_SUCCEED) {
				try {
					this._activeFeatures = SALTR.Deserializer.decodeFeatures(responseData);
				}
				catch (ex) {
					throw new Error("[SALTR] Failed to decode Features.");
				}

				try {
					this._experiments = SALTR.Deserializer.decodeExperiments(responseData);
				}
				catch (ex) {
					throw new Error("[SALTR] Failed to decode Experiments.");
				}

				try {
					this._levelPacks = SALTR.Deserializer.decodeLevels(responseData);
				}
				catch (ex) {
					throw new Error("[SALTR] Failed to decode LevelPacks.");
				}

				this._saltrUserId = responseData.saltId || responseData.saltrUserId;
				this._connected = true;

				this._appDataLoadSuccessCallback();
			}
			else {
				this._appDataLoadFailCallback("[SALTR] Failed to load appData. " + responseData.errorCode + " " + responseData.errorMessage);
			}
			resource.dispose();
		},

		appDataAssetLoadErrorHandler: function(resource) {
			this._appDataLoadFailCallback("[SALTR] Failed to load appData.");
			resource.dispose();
		},

        addUserProperty: function(propertyNames, propertyValues, operations) {
            var self = this,
	            properties = [],
                args = {},
                urlVars = {},
                ticket,
                resource;

            for (var i = 0; i < propertyNames.length; i++) {
                properties.push({
                    key: propertyNames[i],
                    value: propertyValues[i],
                    operation: operations[i]
                });
            }

            args.saltId = this._saltrUserId;
            args.properties = properties;
            args.clientKey = this._clientKey;

            urlVars.cmd = SALTR.Config.COMMAND_ADD_PROPERTY;
            urlVars.arguments = JSON.stringify(args);

            ticket = new SALTR.ResourceTicket(SALTR.Config.SALTR_API_URL, urlVars);
            resource = new SALTR.Resource("userProperty", ticket);
            resource.addEventListener(SALTR.ResourceEvent.COMPLETE, function(event, resource) {
                self.addUserPropertyCompleteHandler(resource);
            });
            resource.addEventListener(SALTR.ResourceEvent.ERROR, function(event, resource) {
                self.addUserPropertyErrorHandler(error);
            });
            resource.load();
        },

        addUserPropertyCompleteHandler: function (resource) {
	        var jsonData = resource.jsonData();
	        resource.dispose();
        },

        addUserPropertyErrorHandler: function (resource) {
	        console.log("asdasdasd");
	        resource.dispose();
        },

        syncDeveloperFeatures: function() {
	        var self = this,
		        urlVars = {},
		        features = this._developerFeatures,
		        feature,
		        featureList = [],
		        ticket,
		        resource;

	        urlVars.cmd = SALTR.Config.COMMAND_SAVE_OR_UPDATE_FEATURE;
	        urlVars.clientKey = this._clientKey;

	        if (this._appVersion) {
		        urlVars.appVersion = this._appVersion;
	        }

	        for (var token in features) {
		        if (features.hasOwnProperty(token)) {
			        feature = features[token];
			        featureList.push({
				        token: feature.token(),
				        value: JSON.stringify(feature.properties())
			        });
		        }
	        }
	        urlVars.data = JSON.stringify(featureList);

	        ticket = new SALTR.ResourceTicket(SALTR.Config.SALTR_URL, SALTR.Utils.serializeURLVariables(urlVars));
	        resource = new SALTR.Resource("syncFeatures", ticket);
	        resource.addEventListener(SALTR.ResourceEvent.COMPLETE, function (event, resource) {
		        self.featureSyncCompleteHandler(resource);
	        });
	        resource.addEventListener(SALTR.ResourceEvent.ERROR, function (event, resource) {
		        self.featureSyncErrorHandler(resource);
	        });

	        resource.load();
         },

        featureSyncCompleteHandler: function (resource) {
	        console.log("[Saltr] Dev feature Sync is complete.");
	        resource.dispose();
        },

        featureSyncErrorHandler: function (resource) {
	        console.log("[Saltr] Dev feature Sync is failed.");
	        resource.dispose();
        },

		loadLevelContentData: function(level, levelLoadCompleteHandler, levelLoadFailedHandler) {
			var self = this,
				ticket,
				resource;

			this._onLevelLoadSuccess = levelLoadCompleteHandler;
			this._onLevelLoadFail = levelLoadFailedHandler;

            //TODO:ggor Remove this replace
			var levelUrl = level._contentDataUrl.replace(":8081", ":8085");

			ticket = new SALTR.ResourceTicket(levelUrl);
			resource = new SALTR.Resource("loadLevel", ticket);
			resource.addEventListener(SALTR.ResourceEvent.COMPLETE, function(event, resource) {
				self.levelLoadCompleteHandler(level, resource);
			});
			resource.addEventListener(SALTR.ResourceEvent.ERROR, function(event, resource) {
				self.levelLoadFailedHandler(resource);
			});
			resource.load();
		},

		levelLoadCompleteHandler: function(level, resource) {
			var jsonData = resource.jsonData();
			level.updateContent(jsonData);
			this._onLevelLoadSuccess();
			resource.dispose();
		},

		levelLoadFailedHandler: function(resource) {
			this._onLevelLoadFail();
			resource.dispose();
		}

	});
})(window);
