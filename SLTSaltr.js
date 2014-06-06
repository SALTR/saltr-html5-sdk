(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.SaltrWeb = function(clientKey) {
        SALTR.EventDispatcher.apply(this);

		this.socialId = null;
		this.socialNetwork = null;
		this.connected = false;
		this.clientKey = clientKey;
		this.saltrUserId = "";
		this.isLoading = false;

		this.activeFeatures = {};
		this.developerFeatures = {};

		this.experiments = [];
		this.levelPacks = [];

		this.appDataLoadSuccessCallback = null;
		this.appDataLoadFailCallback = null;
		this.levelContentLoadSuccessCallback = null;
		this.levelContentLoadFailCallback = null;

		this.requestIdleTimeout = 0;

		this.devMode = true;
		this.appVersion = "";
		this.started = false;
		this.useNoLevels = false;
		this.useNoFeatures = false;
	};

	SALTR.SaltrWeb.prototype = new SALTR.EventDispatcher();

	SALTR.Utils.extend(SALTR.SaltrWeb.prototype, {

		setSocial: function(socialId, socialNetwork) {
			if (typeof socialId == "undefined" || typeof socialNetwork == "undefined") {
				throw new Error("Both variables - 'socialId' and 'socialNetwork' are required and should be non 'null'.");
			}

			this.socialId = socialId;
			this.socialNetwork = socialNetwork;
		},

		getActiveFeatureTokens: function() {
			var tokens = [],
				activeFeatures = this.activeFeatures;
			for (var x in activeFeatures) {
				if (activeFeatures.hasOwnProperty(x)) {
					tokens.push(activeFeatures[x].token());
				}
			}
			return tokens;
		},

		getFeatureProperties: function(token) {
			var activeFeature = this.activeFeatures[token],
				devFeature;
			if (typeof activeFeature != "undefined") {
				return activeFeature.properties();
			}
			else {
				devFeature = this.developerFeatures[token];
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
            this.levelPacks = SALTR.Deserializer.decodeLevels(applicationData);
        },

		importDeveloperFeaturesFromJSON: function(json) {
			var featuresJSON = JSON.parse(json);
			this.developerFeatures = SALTR.Deserializer.decodeFeatures(featuresJSON);
		},

        defineFeature: function(token, properties, required) {
	        required = required || false;
	        if (this.started === false) {
		        this.developerFeatures[token] = new SALTR.Feature(token, properties, required);
	        }
            else {
		        throw new Error("Method 'defineFeature()' should be called before 'start()' only.");
            }
        },

		start: function() {
			if (this.socialId == null || this.socialNetwork == null) {
				throw new Error("'socialId' and 'socialNetwork' fields are required and can't be null.");
			}

			if (this.useNoFeatures == false && SALTR.Utils.getObjectSize(this.developerFeatures) == 0) {
				throw new Error("Features should be defined.");
			}

			if (this.useNoLevels == false && this.levelPacks.length == 0) {
				throw new Error("Levels should be imported.");
			}

			for (var i in this.developerFeatures) {
				if (this.developerFeatures.hasOwnProperty(i)) {
					this.activeFeatures[i] = this.developerFeatures[i];
				}
			}

			this.started = true;
		},

		connect: function(successCallback, failCallback) {
			var self = this,
				resource;

			if (this.isLoading || !this.started) {
				return;
			}

			this.appDataLoadSuccessCallback = successCallback;
			this.appDataLoadFailCallback = failCallback;

			this.isLoading = true;

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
			if (this.socialId != null && this.socialNetwork != null) {
				args.socialId = this.socialId;
				args.socialNetwork = this.socialNetwork;
			}
			else {
				throw new Error("In SALTR for Web 'socialId' and 'socialNetwork' are required fields.");
			}

			args.clientKey = this.clientKey;
			urlVars.args = JSON.stringify(args);

			ticket = new SALTR.ResourceTicket(SALTR.Config.SALTR_API_URL, SALTR.Utils.serializeURLVariables(urlVars));
			return new SALTR.Resource("saltAppConfig", ticket);
		},

		appDataAssetLoadCompleteHandler: function(resource) {
			var data = resource.getJsonData(),
				status = data.status,
				responseData = data.responseData;

			this.isLoading = false;

			if ( this.devMode ) {
				this.syncDeveloperFeatures();
			}

			if (status == SALTR.Config.RESULT_SUCCEED) {
				try {
					this.activeFeatures = SALTR.Deserializer.decodeFeatures(responseData);
				}
				catch (ex) {
					throw new Error("[SALTR] Failed to decode Features.");
				}

				try {
					this.experiments = SALTR.Deserializer.decodeExperiments(responseData);
				}
				catch (ex) {
					throw new Error("[SALTR] Failed to decode Experiments.");
				}

				try {
					this.levelPacks = SALTR.Deserializer.decodeLevels(responseData);
				}
				catch (ex) {
					throw new Error("[SALTR] Failed to decode LevelPacks.");
				}

				this.saltrUserId = responseData.saltId || responseData.saltrUserId;
				this.connected = true;

				this.appDataLoadSuccessCallback();
			}
			else {
				this.appDataLoadFailCallback("[SALTR] Failed to load appData. " + responseData.errorCode + " " + responseData.errorMessage);
			}
			resource.dispose();
		},

		appDataAssetLoadErrorHandler: function(resource) {
			this.appDataLoadFailCallback("[SALTR] Failed to load appData.");
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

            args.saltId = this.saltrUserId;
            args.properties = properties;
            args.clientKey = this.clientKey;

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
	        var jsonData = resource.getJsonData();
	        resource.dispose();
        },

        addUserPropertyErrorHandler: function (resource) {
	        console.log("asdasdasd");
	        resource.dispose();
        },

        syncDeveloperFeatures: function() {
	        var self = this,
		        urlVars = {},
		        features = this.developerFeatures,
		        feature,
		        featureList = [],
		        ticket,
		        resource;

	        urlVars.cmd = SALTR.Config.COMMAND_SAVE_OR_UPDATE_FEATURE;
	        urlVars.clientKey = this.clientKey;

	        if (this.appVersion) {
		        urlVars.appVersion = this.appVersion;
	        }

	        for (var token in features) {
		        if (features.hasOwnProperty(token)) {
			        feature = features[token];
			        featureList.push({
				        token: feature.token,
				        value: JSON.stringify(feature.properties)
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

			this.onLevelLoadSuccess = levelLoadCompleteHandler;
			this.onLevelLoadFail = levelLoadFailedHandler;

            //TODO:ggor Remove this replace
            var levelUrl = level.contentUrl.replace(":8081", ":8085");

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
			var jsonData = resource.getJsonData();
			level.updateContent(jsonData);
			this.onLevelLoadSuccess();
			resource.dispose();
		},

		levelLoadFailedHandler: function(resource) {
			this.onLevelLoadFail();
			resource.dispose();
		}

	});
})(window);
