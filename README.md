<a href="http://promises-aplus.github.com/promises-spec"><img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png" align="right" alt="Promises/A+ logo"/></a>
pzero [![build status](https://secure.travis-ci.org/artjock/pzero.png)](http://travis-ci.org/artjock/pzero)
=====

API extentions for [p0](//github.com/artjock/p0) A+ promises

## How to use

### Node

Install it with NPM or add it to your package.json:

    npm install pzero

Then:

    var pzero = require('pzero');
    
### Browser

    <script src="pzero.js"></script>

## Api

    var promise1 = pzero();
    var promise2 = pzero();

    pzero
        .when([promise1, promise2])
        .then( 
            function(values) {
                var value1 = values[0];
                var value2 = values[1];
            },
            function(reason) {}
        );
        
    promise1
        .fail(function(reason) {});
        
    promise1.callback(function(reason, value) {});
        
    var cb = promise1.callback();
    // reject promise -> cb(reason);
    // fulfill promise -> cb(null, value);
