var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/splash', function(req, res) {
  res.render('splash.html', { root: './public' });
});

//get game page when hit the play button
router.get('/play', function(req,res){
  res.render('game.html', {root: './public'})
})

module.exports = router;
