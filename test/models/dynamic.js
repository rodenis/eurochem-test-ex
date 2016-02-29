var test = require('tape'),
    _ = require('lodash'),
    dynamicModel = require('../../models/dynamic'),
    createModel = dynamicModel.createModel,
    parseModelXML = dynamicModel.parseModelXML,
    loadFromFile = dynamicModel.loadFromFile;

test('Create model', function (t) {
    t.plan(6);

    var MODEL_NAME = 'model_name',
        STRING_FIELD_NAME = 'strField',
        FLOAT_FIELD_NAME = 'floatField',
        FLOAT_FIELD_SIZE = 11,

        typesMock = {
            STRING: 'str',
            FLOAT: function float(size) {
                t.equal(size, FLOAT_FIELD_SIZE, 'Wrong Float field size');
                return float;
            }
        },

        ormMock = {
            define: function (modelName, modelProperties) {
                t.equal(modelName, MODEL_NAME, 'Wrong model name');

                t.equal(modelProperties.hasOwnProperty(FLOAT_FIELD_NAME), true, 'No float field in resulting model');
                t.equal(modelProperties.hasOwnProperty(STRING_FIELD_NAME), true, 'No string field in resulting model');

                t.equal(modelProperties[STRING_FIELD_NAME], typesMock.STRING, 'Wrong type of string field');
                t.equal(modelProperties[FLOAT_FIELD_NAME], typesMock.FLOAT, 'Wrong type of float field');
            }
        },

        model = createModel(MODEL_NAME, [
            {
                name: STRING_FIELD_NAME,
                type: 'STRING'
            },
            {
                name: FLOAT_FIELD_NAME,
                type: 'FLOAT(' + FLOAT_FIELD_SIZE + ')'
            }
        ]);

    model(ormMock, typesMock);
});

test('parse model XML', function (t) {
    t.plan(3);

    var xml = '<model><property name="prop1" type="STRING"></property><property name="prop2" type="FLOAT(11)"></property></model>',
        properties = [
            { name: 'prop1', type: 'STRING' },
            { name: 'prop2', type: 'FLOAT(11)' }
        ];

    parseModelXML(xml).then(function (model) {
        var modelProperties = model.schema,
            names = _.map(modelProperties, _.property('name'));

        t.equal(_.includes(names, 'prop1'), true, 'No prop1 field in resulting model');
        t.equal(_.includes(names, 'prop2'), true, 'No prop2 field in resulting model');

        t.equal(_.isEqual(modelProperties, properties), true, 'Incorrect properties');
    });
});

test('load from XML file', function (t) {
    t.plan(4);

    var properties = [
            { name: 'prop1', type: 'STRING' },
            { name: 'prop2', type: 'FLOAT(11)' }
        ],
        data = [
            { prop1: 'Test1', prop2: '3.14' },
            { prop1: 'Test2', prop2: '123' },
            { prop1: 'Test3', prop2: '0.45' }
        ];

    loadFromFile(__dirname + '/../../data/test_model.xml').then(function (model) {
        var modelProperties = model.schema,
            modelData = model.data,
            names = _.map(modelProperties, _.property('name'));

        t.equal(_.includes(names, 'prop1'), true, 'No prop1 field in resulting model');
        t.equal(_.includes(names, 'prop2'), true, 'No prop2 field in resulting model');

        t.equal(_.isEqual(modelProperties, properties), true, 'Incorrect properties');
        t.equal(_.isEqual(modelData, data), true, 'Incorrect data');

        //console.log(JSON.stringify(model, null, 2));
    });
});