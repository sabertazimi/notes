var express = require('express'),
    router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('default.hbs', { title: 'Sabertazimi\'s Blog' });
});

router.get('/hello', function(req, res, next) {
    res.render('default.hbs', { title: 'Hello Express!' });
});

module.exports = router;
