var Promise = require('bluebird');

function $ajax(method, url, body) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest;
        xhr.addEventListener('error', reject);
        xhr.addEventListener('load', function (ev) {
            var req = ev.target;
            if (req.status >= 200 && req.status < 300) {
                resolve(JSON.parse(req.responseText));
            } else {
                var error = new Error(req.statusText)
                error.response = req;
                reject(error);
            }
        });

        xhr.open(method, url);
        xhr.setRequestHeader('Accept','application/json');

        if (['POST', 'PUT'].indexOf(method) !== -1) {
            xhr.setRequestHeader('Content-Type','application/json');
            xhr.send(JSON.stringify(body));
        } else {
            xhr.send(null);
        }
    });
}

module.exports = $ajax;
