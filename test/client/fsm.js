var test = require('tape'),
    fsm = require('../../client/fsm');

test('fsm', function (t) {
    t.plan(10);

    var sm = fsm({
            states: ['STATE1', 'STATE2'],
            initial: 'STATE1'
        }),
        vals1 = { foo: 'bar' },
        vals2 = { foo: 'baz' };

    sm.setListener('STATE1', function(values) {
        if (values) {
            t.equal(values, vals1, 'Wrong values');
        }
    });

    sm.setListener('STATE2', function(values) {
        t.equal(values, vals2, 'Wrong values');
    });

    t.equal(sm.is('STATE1'), true, 'Wrong current state');
    t.equal(sm.is('STATE2'), false, 'Wrong current state');

    sm.setState('STATE2', vals2);

    t.equal(sm.is('STATE1'), false, 'Wrong current state');
    t.equal(sm.is('STATE2'), true, 'Wrong current state');
    t.equal(sm.stateValues(), vals2, 'Wrong current state values');

    sm.setState('STATE1', vals1);

    t.equal(sm.is('STATE1'), true, 'Wrong current state');
    t.equal(sm.is('STATE2'), false, 'Wrong current state');
    t.equal(sm.stateValues(), vals1, 'Wrong current state values');
});