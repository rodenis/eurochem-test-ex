var test = require('tape'),
    _ = require('lodash'),
    initRoutes = require('../../server/routes_helper');

test('Init routes', function (t) {
    var routerMock = {
            calledCount:  {
                'get': 0,
                'put': 0
            },
            arguments: {
                'get': [],
                'put': []
            },
            'get': function (URL) {
                this.calledCount['get']++;
                this.arguments['get'].push(URL);
            },
            'put': function (URL) {
                this.calledCount['put']++;
                this.arguments['put'].push(URL);
            }
        },
        ROUTES = {
            'get': ['/version', '/', '/list'],
            'put': ['/:id']
        },
        testCount = 1; // router object test

    _.mapValues(ROUTES, function(routes) {
        testCount += routes.length + 1;
    });

    t.plan(testCount);

    initRoutes(routerMock).then(function (router) {
        t.equal(router, routerMock, 'init should return same router object');

        _.mapValues(ROUTES, function(routes, method) {
            t.equal(router.calledCount[method], routes.length, 'Incorrect count of ' + method + ' routes');

            _.each(routes, function (uri) {
                t.equal(_.includes(router.arguments[method], uri), true, 'No router.' + method + ' call for ' + uri);
            });
        });
    });
});