var p = module.exports = function() {
    return new p.prototype._create();
};

p.prototype = {

    /**
     * Initializes promise
     */
    _create: function() {
        this._fulfilled = false;
        this._callbacks = [];
    },

    /**
     * Rewriting constructor
     */
    constructor: p,

    /**
     * Resolving promise
     *
     * @param {Object} value
     */
    resolve: function(value) {
        if (this._fulfilled) {
            return;
        }

        var callback;

        this.value = value;
        this._fulfilled = true;

        while (callback = this._callbacks.shift()) {
            callback(value);
        }
    },

    /**
     * Registering onfulfilled callbacks,
     * method returns promise, so if your callback
     * returns promise you can chain `then`s
     *
     * @example
     *  promise
     *      .then(callback1)
     *      .then(callback2)
     *
     *  callback2 will be executed, when promise from callback1
     *  will be resolved and fulfillment value from this promise
     *  will be passed as argument to callback2
     *
     * @param {Function} callback
     *
     * @return p
     */
    then: function(callback) {
        var promise = p();

        var wrapper = function(value) {

            var result = callback(value);
            if (result instanceof p) {
                result.pipe(promise);
            } else {
                promise.resolve(result);
            }
        };

        if (this._fulfilled) {
            wrapper(this.value);
        } else {
            this._callbacks.push(wrapper);
        }

        return promise;
    },

    pipe: function(promise) {
        this.then(function(value) {
            promise.resolve(value);
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
        p.then(function(value) {
            result[i] = value;
            len--;

            if (!len) {
                current.resolve(result);
            }
        });
    });

    return current;
};
