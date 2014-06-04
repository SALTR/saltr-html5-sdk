(function(window) {
	var SALTR = window.SALTR = window.SALTR || {};

	SALTR.Level = function(id, index, contentDataUrl, properties, version) {
		this._id = id;
		this._index = index;
		this._contentDataUrl = contentDataUrl;
		this._properties = properties;
		this._version = version;
		this._boards = {};
		this._contentReady = false;
		this._levelSettings = {};
		this._boardsNode = {};
	};

	SALTR.Utils.extend(SALTR.Level.prototype, {
		updateContent: function(rootNode) {
			this._boardsNode = rootNode["boards"];
			this._properties = rootNode["properties"];
			this._levelSettings = SALTR.LevelBoardParser.parseLevelSettings(rootNode);
			debugger;
			this.generateAllBoards();
			this._contentReady = true;
		},

		generateAllBoards: function() {
			if (this._boardsNode != null) {
				this._boards = SALTR.LevelBoardParser.parseLevelBoards(this._boardsNode, this._levelSettings);
			}
		},

		generateBoard: function(boardId) {
			if (this._boardsNode != null) {
				this._boards[boardId] = SALTR.LevelBoardParser.parseLevelBoard(this._boardsNode[boardId], this._levelSettings);
			}
		}
	});
})(window);
