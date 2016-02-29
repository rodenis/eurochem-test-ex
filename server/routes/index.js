var _ = require('lodash');

module.exports.method = 'get';
module.exports.uri = '/';
module.exports.processors = [work, require('../routes_helper').format];

function* work(next) {
    var orm = require('../orm'),
        Model = orm.Model,
        data = yield Model.findAll(),
        header = _.filter(_.keys(data[0].dataValues), orm.filterProperties(true));

    this.state.template = 'index';
    this.state.title = 'Click on column header to edit data';
    this.state.data = data;
    this.state.header = header;
    yield next;
}