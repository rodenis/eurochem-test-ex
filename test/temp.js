/**
 * Created by rodenis on 10.02.16.
 */
var test = require('tape'),
    index = require('../index'),
    version = require('../package').version;

test('async index test', function (t) {
    t.plan(1);
    var message = 'current version is ' + version;

    setTimeout(function () {
        t.equal(index(), message);
    }, 500);
});