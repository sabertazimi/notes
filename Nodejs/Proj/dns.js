var dns = require('dns');

dns.resolve('tazimi.tk', 'A', function (err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log('A: ' + JSON.stringify(res, null, 2));
    }
});

dns.resolve('github.com', 'MX', function (err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log('MX: ' + JSON.stringify(res, null, 2));
    }
});
