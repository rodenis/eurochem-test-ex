var _ = require('lodash'),
    $ = require('jquery'),
    $ajax = require('./ajax');

function clickFn(target, hide) {
    return function () {
        target.value = this.innerHTML;
        hide();
    };
}

function clearBlock(block) {
    var ch;
    while (ch = block.firstChild) {
        block.removeChild(ch);
    }
}

function Autocomplete() {
    this._el = document.createElement('div');
    this._$el = $(this._el).addClass('auto-complete auto-complete_hidden');
    document.body.appendChild(this._el);

    this._getData = $ajax('GET', '/list');
}

Autocomplete.prototype = {
    show: function (element, field) {
        var rect = element.getBoundingClientRect(),
            widgetTop = rect.bottom,
            widgetLeft = rect.left,
            style = 'left:' + widgetLeft + 'px; top:' + widgetTop + 'px;',
            _el = this._el,
            fn = clickFn(element, this.hide.bind(this));

        clearBlock(_el);
        this._getData.then(function (res) {
            var elements = _.map(_.uniq(_.map(res, _.property(field))), function (item) {
                var el = document.createElement('div');
                el.innerHTML = item;
                el.setAttribute('class', 'auto-complete__item');
                el.addEventListener('click', fn);

                return el;
            });
            _.each(elements, function (el) {
                _el.appendChild(el);
            });
        });

        this._el.setAttribute('style', style);
        this._$el.removeClass('auto-complete_hidden');
    },

    hide: function() {
        this._$el.addClass('auto-complete_hidden');
    }
};

module.exports = new Autocomplete();