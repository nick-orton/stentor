var tropowebapi = require('tropo-webapi');
var http = require('http');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var _ = require('underscore');

var client = new Db('muppetsdb', new Server('127.0.0.1', 27017));

var server = http.createServer(function (request, response) {

  request.addListener('data', function(data){
         json = data.toString();
  });

  request.addListener('end', function() {
    var tropo = new tropowebapi.TropoWebAPI();
    var session = JSON.parse(json);

    var message = session.session.initialText;
    var caller = session.session.from.id;

    client.open(function(err, pClient) {
      client.collection('muppets', function(err, collection) {
        collection.find().toArray(function(err, members) {
          client.close(); //we don't need no open connections

          var nums = _.map(members, function(e){
            return e.number
          });

          if(_.include(nums, caller)) {
            tropo.say("matches");
          } else {
            tropo.say("not in the group");
          }

          tropo.hangup();

          //do stuff with the members here
          //tropo.say("Hello, " + caller + ":" + message + nums);

          response.writeHead(200, {'Content-Type': 'application/json'});

          response.end(tropowebapi.TropoJSON(tropo));


        });
      });
    });
  });

}).listen(8123);
