var p0 = require('p0');

var pzero = function(val) {
    var promise = new p0();

    if (arguments.length) {
        promise.fulfill(val);
    }

    return promise;
};

pzero.when = function(set) {
    var result, values;
    var length = set.length;

    if (!length) { return pzero([]); }

    values = [];
    result = pzero();

    set.forEach(function(promise, i) {

        promise
            .then(function(value) {
                length -= 1;
                values[i] = value;
                if (!length) {
                    result.fulfill(values);
                }
            }, result.reject.bind(result));
    });

    return result;
};

p0.prototype.fail = function(onReject) {
    return this.then(null, onReject);
};

p0.prototype.node = function(callback) {

    return this.then(
        function(value) {
            return callback(null, value);
        },
        function(reason) {
            return callback(reason);
        }
    );
};

module.exports = pzero;
