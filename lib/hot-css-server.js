console.log("\nStarting Hot CSS Server on port 3210\n");

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 3210 });

wss.on('connection', function connection(ws) {
    
  ws.on('message', function incoming(message) {
    
  });

});

module.exports = {
    
    broadcast: function broadcast(data) {
      wss.clients.forEach(function each(client) {
        client.send(data);
      });
    }
};
