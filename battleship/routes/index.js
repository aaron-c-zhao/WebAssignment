var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('splash.html', { root: './public' });
});

//get game page when hit the play button
router.get('/play', function(req,res){
  res.sendFile('game.html', {root: './public'})
})

module.exports = router;
