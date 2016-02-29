var http = require('http'),
    app = require('./server/app'),
    orm = require('./server/orm'),
    PORT = process.env.PORT || 3000;

orm.init().then(function () {
    console.log('Starting server on port ' + PORT);
    http.createServer(app.callback()).listen(PORT);
}).catch(function (err) {
    throw err;
});