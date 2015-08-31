console.log("\nStarting Hot CSS Server on port 3210\n");

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 3210 });

wss.on('connection', function connection(ws) {
    
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

});

module.exports = {
    
    broadcast: function broadcast(data) {
      wss.clients.forEach(function each(client) {
          console.log(data);
        client.send(data);
      });
    }
};
