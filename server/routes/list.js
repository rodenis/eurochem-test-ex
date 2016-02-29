module.exports.method = 'get';
module.exports.uri = '/list';
module.exports.processors = [work];

function* work(next) {
    var orm = require('../orm'),
        Model = orm.Model,
        data = yield Model.all();
    this.body = data;
    yield next;
}