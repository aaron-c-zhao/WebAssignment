
var express = require('express');
var websocket = require("ws");
var http = require('http');

const filename = process.argv[2];
var port = process.argv[3];

var app = express();



var server = http.createServer(app);
const wss = new websocket.Server({ server });

//TODO game object
// var currentGame = null;
// var connectionID = 0;

wss.on("connection", function connection(ws){
  // let con = ws;
  // con.id = connectionID++;
  //TODO game object
  //let playerID = currentGame.addPlayer(con);
  ws.on("message", function incoming(message){
    console.log(ws.readyState);
  })




})


server.listen(port, function(){
  console.log("listening on port" + port);
});

