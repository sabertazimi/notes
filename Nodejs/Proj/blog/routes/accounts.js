var express = require('express'),
    router = express.Router();

router.get('/', function (req, res) {
    return res.send('This is accounts interface.');
});

router.get('/signin', function (req, res) {
    return res.send('This is sign in interface.');
});

router.get('/signup', function (req, res) {
    return res.send('This is sign up interface.');
});

module.exports = router;
