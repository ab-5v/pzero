;(function(root) {

var p0 = typeof require === 'function' ?
    require('p0') : root.p0;

p0.nextTick = function(cb) {
    if (typeof process !== 'undefined' && process.nextTick) {
        process.nextTick(cb, 0);
    } else {
        setTimeout(cb, 0);
    }
}

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

p0.prototype.callback = function() {
    var that = this;

    return function(err, data) {
        if (err) {
            that.reject(err);
        } else {
            that.fulfill(data);
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = pzero;
} else {
    root.pzero = pzero;
}

})(this);
