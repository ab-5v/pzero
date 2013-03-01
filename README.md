[![build status](https://secure.travis-ci.org/artjock/pzero.png)](http://travis-ci.org/artjock/pzero)

pzero
=====

Small A+ like promise library

## How to use

### Node

Install it with NPM or add it to your package.json:

    npm install pzero

Then:

    var expect = require('pzero');
    
### Browser

<script src="pzero.js"></script>

## Api

    var promise1 = pzero();
    var promise2 = pzero();

    pzero
      .when([promise1, promise2])
      .then(function(results) {
        return {
          result1: results[0],
          result2: results[1]
        };
      })
      .then(function(data) {
        // 3
        return data.result1 + data.result2
      })
      .esle(function(results) {
        // rejected
      });
      
    promise1.resolve(1);
    promise2.resolve(2);
