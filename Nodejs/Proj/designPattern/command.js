module.exports = (function () {
    var manager = {};

    // command to be encapsulted
    manager.isNull = function (nu) {
        return toString.apply(nu) === '[object Null]';
    };
    manager.isArray = function (arr) {
        return toString.apply(arr) === '[object Array]';
    };
    manager.isString = function (str) {
        return toString.apply(str) === '[object String]';
    };
    manager.isNumber = function (num) {
        return toString.apply(num) === '[object Number]';
    };

    // public api
    function execute(command) {
        return manager[command] && manager[command].apply(manager, [].slice.call(arguments, 1));
    }
    function run(command) {
        return manager[command] && manager[command].apply(manager, [].slice.call(arguments, 1));
    }

    return {
        execute: execute,
        run: run
    };
}());
