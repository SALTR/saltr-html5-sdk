(function(window) {
    var SALTR = window.SALTR = window.SALTR || {};

    SALTR.Level = function(id, index, contentUrl, properties, version) {
        this.id = id;
        this.index = index;
        this.contentUrl = contentUrl;
        this.properties = properties || {};
        this.version = version;
        this.boards = {};
        this.contentReady = false;
        this.levelSettings = {};
        this.boardsNode = {};
    };

    SALTR.Utils.extend(SALTR.Level.prototype, {
        updateContent: function(rootNode) {
            if (rootNode.boards) {
                this.boardsNode = rootNode.boards;
            }else {
                throw new Error("Boards node is not found.");
            }
            this.properties = rootNode.properties;
            this.levelSettings = SALTR.LevelBoardParser.parseLevelSettings(rootNode);
            this.generateAllBoards();
            this.contentReady = true;
        },

        generateAllBoards: function() {
            if (this.boardsNode != null) {
                this.boards = SALTR.LevelBoardParser.parseLevelBoards(this.boardsNode, this.levelSettings);
            }
        },

        generateBoard: function(boardId) {
            if (this.boardsNode != null && this.boardsNode[boardId] != null) {
                this.boards[boardId] = SALTR.LevelBoardParser.parseLevelBoard(this.boardsNode[boardId], this.levelSettings);
            }
        }
    });
})(window);
