var Sequelize = require('sequelize'),
    cfg = require('../config/orm'),
    dynamicModel = require('../models/dynamic'),
    Promise = require('bluebird'),
    _ = require('lodash'),

    sequelize = new Sequelize(cfg.db, cfg.user, cfg.password, cfg.params),
    Model;

function init() {
    return dynamicModel.loadFromFile(__dirname + '/../data/model.xml').then(function (model) {
        var modelProperties = model.schema,
            modelData = model.data;

        Model = sequelize.import('model', dynamicModel.createModel('model', modelProperties));
        return Model.sync({ force: true }).then(function () {
            var items = _.map(modelData, function (item) {
                return Model.create(item);
            });

            return Promise.all(items).then(function () {
                return Model;
            });
        });
    });
}

function filterProperties(excludeId) {
    var exclude = ['createdAt', 'updatedAt'];
    if (excludeId) {
        exclude.push('id');
    }

    return function (column) {
        return exclude.indexOf(column) === -1;
    };
}

module.exports.sequelize = sequelize;
module.exports.init = init;
module.exports.filterProperties = filterProperties;
Object.defineProperty(module.exports, 'Model', {
    get: function() { return Model; },
    enumerable: true,
    configurable: true
});
