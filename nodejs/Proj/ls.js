module.exports = function ls(dirName, fileType, callback) {
    var fs = require('fs'),
        path = require('path');

    fs.readdir(dirName, function (err, list) {
        if (err) {
            return callback(err);
        }

        list = list.filter(function (file) {
            return path.extname(file) === '.' + fileType;
        })

        callback(null, list);
    });
};
