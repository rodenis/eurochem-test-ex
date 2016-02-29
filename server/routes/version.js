var version = require('./../../package').version;

module.exports.method = 'get';
module.exports.uri = '/version';
module.exports.processors = [cache, work, require('../routes_helper').format];

var modified = new Date(); // define version modification date at startup

function* cache(next) {
    var ifModifiedSince = this.get('If-Modified-Since');

    this.set({
        'Last-Modified': modified
    });

    if (ifModifiedSince && ifModifiedSince >= modified.toString()) {
        this.status = 304;
        this.body = null;
        return;
    }

    yield next;
}

function* work(next) {
    this.state.template = 'version';
    this.state.version = version;
    yield next;
}