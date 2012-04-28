var tropowebapi = require('tropo-webapi');
var http = require('http');



var server = http.createServer(function (request, response) {

  var tropo = new tropowebapi.TropoWebAPI();
  tropo.say("Hello, World.");
  tropo.hangup();

  // Render out the JSON for Tropo to consume.
  response.writeHead(200, {'Content-Type': 'application/json'});
  response.end(tropowebapi.TropoJSON(tropo));

}).listen(8123);
