var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('reception');
});

router.post('/conf', function(req, res, next) {
  console.log("↓これです");
  console.log(req.body);
  res.render('receptionConf');
});

module.exports = router;