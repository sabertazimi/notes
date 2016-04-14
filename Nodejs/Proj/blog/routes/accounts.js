var express = require('express'),
    router = express.Router();

router.get('/', function (req, res) {
    return res.send('This is accounts interface.');
});

router.get('/signin', function (req, res) {
    return res.send('This is sign in interface.');
});

router.get('/signup', function (req, res) {
    res.render('signup.hbs', { title: 'Sign Up'});
});

module.exports = router;
