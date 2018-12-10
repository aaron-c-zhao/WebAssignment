var express = require('express');
var router = express.Router();
var gameStatus = require("../statusTracker");
var app = express();
app.set("view engine", "ejs");

/* GET home page. */
router.get('/', function(req, res) {
  res.render("splash", {gamesInitialized: gameStatus.gamesInitialized, gamesCompleted: gameStatus.gamesCompleted});
});

//get game page when hit the play button
router.get('/play', function(req,res){
  res.sendFile('game.html', {root: './public'})
})

module.exports = router;
