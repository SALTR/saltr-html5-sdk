(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.Deserializer = {
		decodeExperiments: function(jsonData) {
			var experiments = [],
				experimentNodes = jsonData.experiments || jsonData.experimentInfo,
				experimentNode;

			for (var i = 0, length = experimentNodes.length; i < length; i++) {
				experimentNode = experimentNodes[i];
				experiments.push({
					token: experimentNode.token,
					partition: experimentNode.partition || experimentNode.partitionName,
					type: experimentNode.type,
					customEvents: experimentNode.customEvents
				});
			}

			return experiments;
		},

		decodeFeatures: function(jsonData) {
			var features = {},
				featureNodes = jsonData.features || jsonData.featureList,
				featureNode;

			for (var i = 0, length = featureNodes.length; i < length; i++) {
				featureNode = featureNodes[i];
				features[featureNode.token] = new SALTR.Feature(featureNode.token, featureNode.data);
			}

			return features;
		},

		decodeLevels: function(jsonData) {
			var levelPacks = [],
				levels,
				levelPackNodes = jsonData.levelPacks || jsonData.levePackList,
				levelPackNode,
				levelNodes,
				levelNode;

			for (var i = 0, levelPacksLength = levelPackNodes.length; i < levelPacksLength; i++) {
				levelPackNode = levelPackNodes[i];
				levelNodes = levelPackNode.levels || levelPackNode.levelList;

				levels = [];
				if (levelNodes) {
					for (var j = 0, levelsLength = levelNodes.length; j < levelsLength; j++) {
						levelNode = levelNodes[j];
						levels.push(new SALTR.Level(levelNode.id, levelNode.index, levelNode.url, levelNode.properties, levelNode.version));
					}
				}

				levelPacks.push(new SALTR.LevelPack(levelPackNode.token, levelPackNode.index, levels));
			}

			return levelPacks;
		}
	};
})(window);
