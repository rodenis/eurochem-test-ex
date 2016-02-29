var bodyParser = require('koa-body')();

module.exports.method = 'put';
module.exports.uri = '/:id';
module.exports.processors = [bodyParser, work];

function* work(next) {
    var orm = require('../orm'),
        Model = orm.Model,
        id = this.params.id,
        body = this.request.body,
        data = yield Model.findById(id).then(function(model) {
            return model.updateAttributes(body);
        });

    this.body = data;
    yield next;
}