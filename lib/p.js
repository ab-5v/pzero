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
        if (this.data) {
            callback(this.data);
        } else {
            this._callbacks.push(callback);
        }
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
