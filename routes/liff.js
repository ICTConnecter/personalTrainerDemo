var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('reception');
});

router.post('/conf', function(req, res, next) {
  console.log(req.body['name']);
  res.render('receptionConf');
});

module.exports = router;