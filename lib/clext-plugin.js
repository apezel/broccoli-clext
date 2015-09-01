var ClextPlugin = function() {}

ClextPlugin.prototype.modifyTree = function(tree) { return tree; };
ClextPlugin.prototype.onPostCopy = function(files) { return files; };
ClextPlugin.prototype.onBuild = function(results) { return results; };
ClextPlugin.prototype.onBuildSuccess = function(results) { /* to be implemented */ };
ClextPlugin.prototype.onBuildError = function(error) { /* to be implemented */ };

module.exports = ClextPlugin;