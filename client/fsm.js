function fsm(options) {
    return new Fsm(options);
}

function Fsm(options) {
    this._states = options.states;
    this._values = {};
    this._previousSate = null;

    this.setState(options.initial);
}

Fsm.prototype = {
    setState: function (state, values) {
        if (this._states.indexOf(state) === -1) {
            throw new Error('State `' + state + '` not supported');
        }

        var changeEvent;
        if (this._state !== state) {
            if (this._previousSate) {
                this._values[this._previousSate] = void 0;
            }

            this._previousSate = this._state;
            this._state = state;

            this._values[state] = values;

            changeEvent = this['on'+state];
            if (typeof changeEvent === 'function') {
                changeEvent(values);
            }
        }
    },

    is: function (state) {
        return this._state === state;
    },

    setListener: function (state, listener) {
        if (this._states.indexOf(state) === -1) {
            throw new Error('State `' + state + '` not supported');
        }

        this['on'+state] = listener;
        if (this._state === state) {
            listener();
        }
    },

    stateValues: function () {
        return this._values[this._state];
    }
};

module.exports = fsm;