var ClextPlugin = require('../clext-plugin'),
    WebSocketServer = require('ws').Server,
    writeFile = require('broccoli-file-creator'),
    mergeTrees = require('broccoli-merge-trees'),
    fs = require('fs'),
    path = require('path');

HotCSS.prototype = Object.create(ClextPlugin.prototype);
HotCSS.prototype.constructor = HotCSS;

function HotCSS(options) {
    
    options = options || {};
    this.port = options.port || 3210;
    
    this.wss = new WebSocketServer({ port: this.port });
    
    console.log("\nStarting Hot CSS Server on port "+this.port+"\n");
    
}

HotCSS.prototype.broadcast = function broadcast(data) {
    
    this.wss.clients.forEach(function each(client) {

        try {

            client.send(new Buffer(data).toString('base64'));

        } catch (error) {

            console.log(error);

        }

    });
    
};

HotCSS.prototype.modifyTree = function(tree) {
    
    var jsClient = fs.readFileSync(__dirname+'/hot-css-client.js', 'utf8');
    return mergeTrees([writeFile('hot-css-client.js', jsClient.replace(/@port@/g, this.port)), tree]);
    
}

ClextPlugin.prototype.postCopy = function(files) {
    
    this.broadcast(files.map(function(f) { return "reload:"+path.basename(f); }).join(";"));
    
    return files;
    
};

ClextPlugin.prototype.onBuildSuccess = function(result) {
    
    this.broadcast("build-success:"+result.length);
    
};

ClextPlugin.prototype.onBuildError = function(err) {

    var msg = "Unknow error";

    if (err.stack) {
        msg = err.stack+"\n";
    } else if (err.message) {
        msg = err.message+"\n";
    }
    
    this.broadcast("build-error:"+msg.replace(/\n/g, "<br/>")); 

};

module.exports = HotCSS;


