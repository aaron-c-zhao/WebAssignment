
var express = require('express');
var websocket = require("ws");
var http = require('http');

var indexRouter = require('./routes/index');
var gameStatus = require('./statusTracker');
var Game = require('./game');

var port = process.argv[2];

var app = express();

app.set("view engine", "ejs");
// app.set('views', __dirname + '/views');

app.use('/',indexRouter);
app.use(express.static(__dirname + "/public"));

var server = http.createServer(app);
const wss = new websocket.Server({ server });

//the object for started game
var gameStarted = {};



var connectionID = 0;
var currentGame = new Game(gameStatus.gamesInitialized++);


wss.on("connection", function connection(ws){
  //track online gamers
  let player = ws;
  gameStatus.onlineGamers++;

  //every player has a unique id
  player.id = connectionID++;
  let playerType = currentGame.addPlayer(player);

  //every two players' id point to the same game object
  gameStarted[player.id] = currentGame;

  //player.id will change once a new player connected, so use anyother reference point to that
  //particular game
  let gameObj = {};
  
  //once player enter the game determine whether it's playerA or B, playerA will fire first
  if(playerType == "A")
    player.send(JSON.stringify({type:"PLAYER TYPE", data:"A"}));
  else player.send(JSON.stringify({type:"PLAYER TYPE", data:"B"}));

  if(currentGame.currentStatus() == "1 JOINT")
    player.send(JSON.stringify({type:"1 JOINT", data:null}));
  else if(currentGame.currentStatus() == "2 JOINT"){

    //currentGame will point to a new game object, so next player connected to the server will
    //be distributed into a new game
    currentGame = new Game(gameStatus.gamesInitialized++)
    gameObj = gameStarted[player.id];
    console.log(gameObj.playerA);
    console.log(gameObj.playerB);

    //2 JOINT players can begin to place there ship
    gameObj.playerA.send(JSON.stringify({type:"2 JOINT", data:null}));
    gameObj.playerB.send(JSON.stringify({type:"2 JOINT", data:null}));
  }


  player.on("message", function incoming(message){
    let inComingMeg = JSON.parse(message);
    let gameObj = gameStarted[player.id];
    let isPlayerA = (gameObj.playerA == player) ? true : false;

    if(inComingMeg.type == "READY"){
      player.send(JSON.stringify({type:"READY CONFIRM",data:null}));
      if(gameObj.currentStatus() == "2 JOINT")   
        gameObj.setStatus("1 READY");
      else if(gameObj.currentStatus() == "1 READY"){
        gameObj.setStatus("2 READY");
        gameObj.playerA.send(JSON.stringify({type:"2 READY", data:null}));
        gameObj.playerB.send(JSON.stringify({type:"2 READY", data:null}));
      }
          
    }
    else if(inComingMeg.type == "FIRE"){
      if(isPlayerA)
        gameObj.playerB.send(message);
      else gameObj.playerA.send(message);
    }

    else if(inComingMeg.type == "MISS" || inComingMeg.type == "HIT"){
      if(isPlayerA)
        gameObj.playerB.send(message);
      else gameObj.playerA.send(message);
    }


    else if(inComingMeg.type == "SUNK"){
      if(isPlayerA)
        gameObj.playerB.send(message);
      else gameObj.playerA.send(message);
    }

    else if(inComingMeg.type == "WON"){
      gameStatus.gamesCompleted++;
      let whoWon = "";
      if(isPlayerA){
        whoWon = "B WON";
        gameObj.playerB.send(JSON.stringify({type:"WON", data:null}));
        gameObj.playerA.send(JSON.stringify({type:"LOSE", data:null}));
      }
      else{
        whoWon = "A WON";
        gameObj.playerA.send(JSON.stringify({type:"WON", data:null}));
        gameObj.playerB.send(JSON.stringify({type:"LOSE", data:null}));
      }
      gameObj.setStatus(whoWon);
    }
  })

  //TODO: player.on(close, function(){})
  player.on("close", function (code) {
        
    /*
     * code 1001 means almost always closing initiated by the client;
     */
    console.log(player.id + " disconnected ...");

    if (code == "1001") {
        /*
        * if possible, abort the game; if not, the game is already completed
        */
        let gameObj = gameStarted[player.id];

        if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
            gameObj.setStatus("ABORTED"); 
            gameStatus.gamesAborted++;

            /*
             * determine whose connection remains open;
             * close it
             */
            try {
                gameObj.playerA.close();
                gameObj.playerA = null;
            }
            catch(e){
                console.log("Player A closing: "+ e);
            }

            try {
                gameObj.playerB.close(); 
                gameObj.playerB = null;
            }
            catch(e){
                console.log("Player B closing: " + e);
            }                
        }
        
    }
});


})


server.listen(port, function(){
  console.log("listening on port" + port);
});

