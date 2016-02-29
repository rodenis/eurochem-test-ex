var _ = require('lodash'),
    Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs')),
    path = require('path'),
    render = require('dot').process({ path: path.join(__dirname, 'views') });

function addRoute(router, route) {
    var method = router[route.method];

    if (typeof method !== 'function') {
        throw new Error('Method not supported: ' + route.method + ' (' + route.uri + ')');
    }

    method.apply(router, [route.uri].concat(route.processors));
}

function predicate(fileName) {
    return fileName.indexOf('.js') >= 0;
}

function init(router) {
    var routesPath = path.join(__dirname, 'routes');

    return fs.readdirAsync(routesPath).then(function (files) {
        var routes = _.map(_.filter(files, predicate), function(file) {
            return require(path.join(routesPath, file));
        });

        _.each(routes, addRoute.bind(null, router));

        return router;
    });
}

function* format() {
    var state = this.state;

    switch (this.accepts('json', 'html', 'text')) {
        case 'json':
            this.body = state;
            break;
        case 'html':
            if (typeof render[state.template] === 'function') {
                this.body = render[state.template](state);
            } else {
                this.throw(501, 'No template');
            }
            break;
        case 'text':
            this.body = JSON.stringify(state);
            break;
        default: this.throw(406, 'json, html, or text only');
    }
}

module.exports = init;
module.exports.format = format;

