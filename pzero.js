;(function(root) {

var proto, pzero;
var _IS_VALUE = '[object pzero]';

pzero = function() {
    return new proto._create();
};

proto = pzero.prototype = {

    /**
     * Initializes promise
     */
    _create: function() {
        this._is = _IS_VALUE;

        this._rejected = false;
        this._resolved = false;

        this._onReject = [];
        this._onResolve = [];
    },

    /**
     * Resolves promise with value
     *
     * @param {Object} value
     */
    resolve: function(value) {
        if (this._rejected || this._resolved) {
            return;
        }

        var callback;

        this.value = value;
        this._resolved = true;

        while ( callback = this._onResolve.shift() ) {
            callback(value);
        }

        return this;
    },

    /**
     * Rejects promise with error
     *
     * @param {Object} value
     */
    reject: function(value) {
        if (this._rejected || this._resolved) {
            return;
        }

        var callback;
        var original = this;
        this.value = value;
        this._rejected = true;

        // executes callbacks througnt all chain
        while ( original ) {
            while ( callback = original._onReject.shift() ) {
                callback(value);
            }
            original = original.child;
        }

        return this;
    },

    /**
     * Registering onresolved callbacks,
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
     * @return pzero
     */
    then: function(callback) {

        // if allready rejected -
        // pass throught and do not execute callback
        if (this._rejected) {
            return this;
        }

        var promise = pzero();

        // save link to meta promise
        this.child = promise;

        var wrapper = function(value) {

            var result = callback(value);
            // check if object is pzero instance
            if (pzero.is(result)) {
                result.pipe(promise);
            } else {
                promise.resolve(result);
            }
        };

        if (this._resolved) {
            wrapper(this.value);
        } else {
            this._onResolve.push(wrapper);
        }

        return promise;
    },

    esle: function(callback) {

        if (this._rejected) {
            callback(this.value);
        } else {
            this._onReject.push(callback);
        }

        return this;
    },

    pipe: function(promise) {
        this.then(function(value) {
            promise.resolve(value);
        });

        return this;
    },

    /**
     * Tests object to be a pzero instance
     *
     * @return String
     */
    toString: function() {
        return TO_STRING_VALUE;
    }
};

proto._create.prototype = proto;

/**
 * Tests if object is pzero's instatnce
 *
 * @param Object
 *
 * @return Boolean
 */
pzero.is = function(obj) {
    return typeof obj === 'object' && obj._is === _IS_VALUE;
}

/**
 * Waits for all promises to be fulfilled
 *
 * @param {Array} promises
 *
 * @return pzero
 */
pzero.when = function(promises) {
    var promise = pzero();
    var result = [];
    var len = promises.length;

    if (len) {
        promises.forEach(function(current, i) {
            current
                .then(function(value) {
                    result[i] = value;
                    len--;

                    if (!len) {
                        promise.resolve(result);
                    }
                })
                .esle(function(value) {
                    promise.reject(value);
                });
        });
    } else {
        promise.resolve([]);
    }

    return promise;
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = pzero;
} else {
    root.pzero = pzero;
}

})(this);
