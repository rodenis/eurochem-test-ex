/**
 * Created by rodenis on 10.02.16.
 */
var version = require('./package').version;

module.exports = function () {
    return 'current version is ' + version;
};