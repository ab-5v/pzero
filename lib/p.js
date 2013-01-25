var p = module.exports = function() {
    return new p.prototype._create();
};

p.prototype = {
    _create: function() {
        this._callbacks = [];
    },
    constructor: p,
    resolve: function(data) {
        var callback;
        this.data = data;
        while (callback = this._callbacks.shift()) {
            callback(data);
        }
    },
    then: function(callback) {
        var promise = p();

        var wrapper = function(data) {

            var result = callback(data);
            if (result instanceof p) {
                result.pipe(promise);
            } else {
                promise.resolve(result);
            }
        };

        if ('data' in this) {
            wrapper(this.data);
        } else {
            this._callbacks.push(wrapper);
        }

        return promise;
    },

    pipe: function(promise) {
        this.then(function(data) {
            promise.resolve(data);
        });
        return this;
    }
};

p.prototype._create.prototype = p.prototype;

p.when = function(promises) {
    var current = p();
    var result = [];
    var len = promises.length;

    promises.forEach(function(p, i) {
        p.then(function(data) {
            result[i] = data;
            len--;

            if (!len) {
                current.resolve(result);
            }
        });
    });

    return current;
}
