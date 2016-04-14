var express = require('express'),
    router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('This is users interface.');
});

module.exports = router;
