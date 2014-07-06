if (typeof require === 'function') {
    sinon = require('sinon');
    expect = require('expect.js');
    p0 = require('p0');
    pzero = require('../../index.js');
}

describe('pzero', function() {

    beforeEach(function() {
        this.promise = pzero();
    });

    describe('constructor', function() {

        it('should return promise', function() {
            var promise = pzero();

            expect( promise.then ).to.be.a(Function);
        });

        it('should return resolved promise', function(done) {
            var promise = pzero('foo');

            promise.then(function(value) {
                expect( value ).to.eql( 'foo' );
                done();
            });
        });

        it('should resolve promise with falsy value', function(done) {
            var promise = pzero(undefined);

            promise.then(function(value) {
                expect( value ).to.eql( undefined );
                done();
            });
        });

    });

    describe('fail', function() {

        it('should not run callback when fulfilled', function(done) {
            this.promise.fail(done);
            this.promise.then(function() { done(); });

            this.promise.fulfill(123);
        });

        it('should run callback when rejected', function(done) {
            this.promise.fail(function() {
                done();
            });

            this.promise.reject(123);
        });

    });

    describe('node', function() {

        beforeEach(function() {
            this.cb = this.promise.node();
        });

        it('should reject promise when callback gets reason', function(done) {
            this.promise.then(null, function(reason) {
                expect( reason ).to.eql( 123 );
                done();
            });

            this.cb(123);
        });

        it('should fulfill promise when calback gets value', function(done) {
            this.promise.then(function(value) {
                expect( value ).to.eql( 123 );
                done();
            }, null);

            this.cb(null, 123);
        });

        it('should run callback with reason', function(done) {
            this.promise.node(function(err, data) {
                expect( err ).to.eql( 123 );
                expect( arguments.length ).to.eql( 1 );
                done();
            });
            this.promise.reject(123);
        });

        it('should run callback with data', function() {
            this.promise.node(function(err, data) {
                expect( err ).to.eql( null );
                expect( data ).to.eql( 123 );
            });
            this.promise.fulfill(123);
        });

    });

    describe('pipe', function() {

        it('should pipe fulfillment', function(done) {
            var test = pzero();

            this.promise.pipe(test);

            test.then(function(value) {
                expect( value ).to.eql( 2 );
                done();
            });

            this.promise.fulfill(2);
        });

        it('should pipe rejection', function(done) {
            var test = pzero();

            this.promise.pipe(test);

            test.then(null, function(reason) {
                expect( reason ).to.eql( 3 );
                done();
            });

            this.promise.reject(3);
        });

        it('should return promise', function() {
            var piped = this.promise.pipe(pzero());

            expect( pzero.is(piped) ).to.be.ok();
        });

        it('should ignore non-promise values', function() {
            var piped = this.promise.pipe(function() {});

            expect( piped ).to.equal( this.promise );
        });

    });

    describe('pzero.when', function() {

        it('should fulfill on all promises fulfilled', function(done) {
            pzero
                .when([pzero(1), pzero(2), pzero(3)])
                .then(function(values) {
                    expect( values ).to.eql( [1, 2, 3] );
                    done();
                });
        });

        it('should should reject on any promise rejected', function(done) {
            var promise = pzero();

            pzero
                .when([pzero(1), promise, pzero(2)])
                .then(done, function(reason) {
                    expect( reason ).to.eql( 123 );
                    done();
                });

            promise.reject(123);
        });

    });

});
