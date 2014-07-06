;(function(root) {
'use strict';

var p0 = typeof require === 'function' ?
    require('p0') : (root || window).p0;

var pzero = function(val) {
    var promise = new p0();

    if (arguments.length) {
        promise.fulfill(val);
    }

    return promise;
};

pzero.when = function(set) {
    var result, values, i;
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

pzero.is = function(promise) {
    return promise && typeof promise.then == 'function';
};

p0.prototype.fail = function(onReject) {
    return this.then(null, onReject);
};

p0.prototype.node = function(callback) {
    var that = this;

    return typeof callback === 'function' ?
        this.then(
            function(value) { return callback(null, value); },
            function(reason) { return callback(reason); }
        ):
        function(err, data) {
            if (err) {
                that.reject(err);
            } else {
                that.fulfill(data);
            }
        };
};

p0.prototype.pipe = function(promise) {

    return !pzero.is(promise) ? this : this.then(
        function(value) { promise.fulfill(value); },
        function(reason) { promise.reject(reason); }
    );
};

p0.prototype.callback = p0.prototype.node;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = pzero;
} else {
    root.pzero = pzero;
}

})(this);
