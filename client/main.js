var Kefir = require('kefir'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    $ = require('jquery'),
    $ajax = require('./ajax'),
    autocomplete = require('./autocomplete'),

    headerClicks = Kefir.fromEvents(document.querySelector('#model-table > thead'), 'click').map(function (e) {
        return e.target;
    }),
    saveClicks = Kefir.fromEvents(document.querySelector('#save-btn'), 'click'),
    cellClicks = Kefir.fromEvents(document.querySelector('#model-table > tbody'), 'click').map(function (e) {
        return e.target;
    }).filter(function (el) {
        var stateValues = fsm.stateValues() || {};
        return el.getAttribute('data-field') !== stateValues.column;
    }),

    fsm = require('./fsm')({
        states: ['SHOW', 'EDIT', 'SAVE'],
        initial: 'SHOW'
    }),

    oldValues = {};

function inputFocus() {
    var stateValues = fsm.stateValues() || {};
    autocomplete.show(this, stateValues.column);
}

function defInterface() {
    var inputs;

    $('#save-btn').addClass('save-btn_hidden');
    $('.table__header').removeClass('table__header_edit');
    $('.table__cell').removeClass('table__cell_edit').removeClass('table__cell_modified');

    inputs = $('.model-input').toArray();
    _.each(inputs, function (input) {
        var val = input.value;
        input.removeEventListener('focus', inputFocus);
        input.parentNode.innerHTML = val;
    });

    autocomplete.hide();

    headerClicks.onValue(headerClickHandler);
    saveClicks.offValue(saveClickHandler);
    cellClicks.offValue(cellClickHandler);
}

fsm.setListener('SAVE', function() {
    defInterface();
});

fsm.setListener('SHOW', function(values) {
    defInterface();

    if (values && values.actual) {
        _.each(values.actual, function (item) {
            $('table td[data-field="' + values.column + '"][data-id="' + item.id + '"]').html(item[values.column]);
        });
    }
});

fsm.setListener('EDIT', function(values) {
    var cells;

    oldValues = {};

    $('#save-btn').removeClass('save-btn_hidden');
    $(values.element).addClass('table__header_edit');
    cells = $('table td[data-field="' + values.column + '"]').toArray();

    _.each(cells, function (cell) {
        var val = cell.innerHTML,
            input = document.createElement('input'),
            id = cell.getAttribute('data-id');

        oldValues[id] = val;
        input.setAttribute('type', 'text');
        input.value = val;
        input.setAttribute('data-field', values.column);
        input.setAttribute('data-id', id);
        input.setAttribute('class', 'model-input');
        input.addEventListener('focus', inputFocus);

        cell.innerHTML = '';
        cell.appendChild(input);
    });

    saveClicks.onValue(saveClickHandler);
    headerClicks.offValue(headerClickHandler);
    cellClicks.onValue(cellClickHandler);
});

function headerClickHandler(el) {
    fsm.setState('EDIT', { element: el, column: el.innerHTML });
}

function saveValues(values, column) {
    return Promise.all(_.map(values, function (value) {
        return $ajax('PUT', '/' + value.id, value);
    }));
}

function saveClickHandler() {
    $ajax('GET', '/list').then(function (serverValues) {
        var actualValues = {},
            eql = true,
            column = fsm.stateValues().column,
            inputs = $('.model-input').toArray(),
            newValues = {},
            valuesToSave = [];

        _.each(serverValues, function (item) {
            actualValues[item.id] = item[column];
        });

        _.each(inputs, function (input) {
            var id = input.getAttribute('data-id'),
                saveItem = { id: id };
            saveItem[column] = input.value;
            newValues[id] = input.value;

            if (newValues[id] != oldValues[id]) {
                valuesToSave.push(saveItem);
            }
        });

        fsm.setState('SAVE');

        _.each(_.keys(oldValues), function (id) {
            // use non strict compare because we have different types
            if (actualValues[id] != oldValues[id] && oldValues[id] != newValues[id]) {
                eql = false;
                $('td[data-id="' + id + '"]').addClass('table__cell_modified');
            }
        });

        if (!eql) {
            if (confirm('Данные на сервере были обновлены. Применить изменения?')) {
                return saveValues(valuesToSave, column).then(function () {
                    fsm.setState('SHOW');
                });

            } else {
                //загрузить actualValues
                fsm.setState('SHOW', { actual: serverValues, column: column });
            }
        } else {
            return saveValues(valuesToSave, column).then(function () {
                fsm.setState('SHOW');
            });
        }
    });
}

function cellClickHandler() {
    autocomplete.hide();
}
