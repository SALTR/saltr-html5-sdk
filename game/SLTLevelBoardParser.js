(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	var parseBoardAssets = function(assetNodes) {
		debugger;
		var assets = {};
		for (var assetId in assetNodes) {
			if (assetNodes.hasOwnProperty(assetId)) {
				assets[assetId] = parseAsset(assetNodes[assetId]);
			}
		}
		return assets;
	};

	var parseAsset = function(assetNode) {
		if (assetNode.cells) {
			var cellInfos = assetNode.cellInfos || assetNode.cells;
			//return new SALTR.CompositeAsset(cellInfos, assetNode.type, assetNode.keys);
		}
	};

	var parseAssetStates = function() {};

	SALTR.LevelBoardParser = {
		parseLevelSettings: function(rootNode) {
			return new SALTR.LevelSettings(parseBoardAssets(rootNode["assets"]), rootNode["keySets"], parseAssetStates(rootNode["assetStates"]));
		},

		parseLevelBoards: function() {

		},

		parseLevelBoard: function() {

		}
	};
})(window);
