var app = require('koa')(),
    router = require('koa-router')(),
    initRoutes = require('./routes_helper'),
    serve = require('koa-static')(__dirname + '/../static'),
    mount = require('koa-mount');

// x-response-time
app.use(function* (next){
    var start = new Date;
    yield next;
    var ms = new Date - start;
    this.set('X-Response-Time', ms + 'ms');
});

// serve static
app.use(mount('/static', serve));

initRoutes(router).then(function (router) {
    app.use(router.routes());
});

module.exports = app;