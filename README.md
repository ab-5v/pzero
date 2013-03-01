[![build status](https://secure.travis-ci.org/artjock/pzero.png)](http://travis-ci.org/artjock/pzero)

pzero
=====

Small A+ like promise library

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
      .then(function(results) { return { a: results[0], b: results[1] }; })
      .then(function(data) { alert( data.a + data.b ); /* 3 */ })
      .esle(function(results) { /* rejected */ });
      
    promise1.resolve(1);
    promise2.resolve(2);
