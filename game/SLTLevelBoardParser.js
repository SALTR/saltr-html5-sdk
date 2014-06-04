(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	var parseBoardAssets = function(assetNodes) {
		var assets = {};
		for (var assetId in assetNodes) {
			if (assetNodes.hasOwnProperty(assetId)) {
				assets[assetId] = parseAsset(assetNodes[assetId]);
			}
		}
		return assets;
	};

	var parseAsset = function(assetNode) {
		if (assetNode.cellInfos || assetNode.cells) {
			var cellInfos = assetNode.cellInfos || assetNode.cells;
			return new SALTR.CompositeAsset(cellInfos, assetNode.type, assetNode.keys);
		}

		var type = assetNode.type || assetNode.type_key;
		return new SALTR.Asset(type, assetNode.keys);
	};

	var parseAssetStates = function(stateNodes) {
		var states = {};
		for (var stateId in stateNodes) {
			if (stateNodes.hasOwnProperty(stateId)) {
				states[stateId] = stateNodes[stateId];
			}
		}
		return states;
	};

	SALTR.LevelBoardParser = {
		parseLevelSettings: function(rootNode) {
			return new SALTR.LevelSettings(parseBoardAssets(rootNode["assets"]), parseAssetStates(rootNode["assetStates"]));
		},

		parseLevelBoards: function() {

		},

		parseLevelBoard: function() {

		}
	};
})(window);
