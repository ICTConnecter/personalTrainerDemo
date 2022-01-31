var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('A-1_AccountRegist');
});

router.post('/a2', function(req, res, next) {
  console.log(req.body);
  res.render('A-2_AccountRegist-confirm');
});

module.exports = router;