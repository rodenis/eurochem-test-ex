var _ = require('lodash'),
    Promise = require('bluebird'),
    readFile = Promise.promisify(require('fs').readFile),
    parseString = Promise.promisify(require('xml2js').parseString);

function parseXML(xml) {
    return parseString(xml).then(function (parsed) {
        var data = parsed.model.data || [ { row: [] } ];

        return {
            schema: _.map(parsed.model.property, _.property('$')),
            data: _.map(data[0].row, function (row) {
                return _.mapValues(row, _.head);
            })
        };
    });
}

function createModel(name, properties) {
    var props = _.map(properties, function (property) {
        return property.name + ':DataTypes.' + property.type;
    });

    return new Function('sequelize', 'DataTypes',
        'return sequelize.define("' + name + '", {' +
        props.join(',') +
        '})');
}

function loadFromFile (fileName) {
    return readFile(fileName).then(parseXML);
}

module.exports.createModel = createModel;
module.exports.parseModelXML = parseXML;
module.exports.loadFromFile = loadFromFile;