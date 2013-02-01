var sinon = require('sinon');
var expect = require('expect.js');
var p = require('../../lib/p.js');


describe('promise', function() {
    beforeEach(function() {
        this.promise = p();
    });

    it('should be instance of p', function() {
        expect(this.promise instanceof p).to.be.ok();
    });

    it('should fire with resolve at the end', function(done) {
        this.promise.then(function(data) {
            expect(data).to.eql(1);
            done();
        });

        this.promise.resolve(1);
    });

    it('should fire with resolve at the begining', function(done) {
        this.promise.resolve(1);

        this.promise.then(function(data) {
            expect(data).to.eql(1);
            done();
        });

    });

    it('should fire with async resolve at the end', function(done) {
        this.promise.then(function(data) {
            expect(data).to.eql(1);
            done();
        });

        setTimeout(function() {
            this.promise.resolve(1);
        }.bind(this), 20);

    });

    it('should fire with async resolve at the begining', function(done) {
        setTimeout(function() {
            this.promise.resolve(1);
        }.bind(this), 20);

        this.promise.then(function(data) {
            expect(data).to.eql(1);
            done();
        });

    });

    it('should fire with reject at the end', function(done) {
        this.promise.esle(function(err) {
            expect(err).to.be(2);
            done();
        });

        this.promise.reject(2);
    });

    it('should fire with reject at the beginning', function(done) {
        this.promise.reject(2);

        this.promise.esle(function(err) {
            expect(err).to.be(2);
            done();
        });
    });

    it('should not change state from resolved to rejected', function(done) {
        this.promise
            .then(function(value) { expect(value).to.be(4); })
            .esle(function(err) { expect(1).to.be(2); });

        this.promise.resolve(4);
        this.promise.reject(3);

        setTimeout(done, 20);
    });

    it('should not change state from resolved to rejected', function(done) {
        this.promise
            .then(function(value) { expect(2).to.be(4); })
            .esle(function(err) { expect(err).to.be(3); })

        this.promise.reject(3);
        this.promise.resolve(4);

        setTimeout(done, 20);
    });

    it('should allow then after else but not call one', function(done) {
        this.promise
            .esle(function(err) { expect(err).to.be(3); })
            .then(function(value) { expect(2).to.be(4); })

        this.promise.reject(3);
        this.promise.resolve(4);

        setTimeout(done, 20);
    });

    it('should fire multiple callbacks', function() {
        var count = '';
        this.promise.then(function() { count+='a'; });

        this.promise.resolve();
        this.promise.resolve();

        expect(count).to.eql('a');
    });

    it('should call each callback only once', function() {
        var count = ''
        this.promise.then(function() { count+='a'; });

        this.promise.resolve();
        this.promise.resolve();

        expect(count).to.eql('a');
    });

    it('should not change value', function(done) {
        this.promise.resolve(2);
        this.promise.resolve(3);

        this.promise.then(function(value) {
            expect(value).to.be(2);
            done();
        })
    });

    it('should wait for promise', function(done) {
        p.when([this.promise]).then(function(data) {
            expect(data[0]).to.eql(1);
            done();
        });

        this.promise.resolve(1);
    });

    it('should wait for multiple promises', function() {
        var res = 0;
        var p1 = p();
        var p2 = p();
        var p3 = p();

        p.when([p1,p2,p3]).then(function() {
            res = 1;
        });

        p1.resolve();
        expect(res).to.eql(0);
        p2.resolve();
        expect(res).to.eql(0);
        p3.resolve();
        expect(res).to.eql(1);
    });

    it('should be resolved with falsy value', function() {
        var p1 = p();
        var callback = sinon.spy();

        p1.resolve(false);
        p1.then(callback);

        expect(callback.called).to.be.ok();
    });

    it('should chain promises', function(done) {
        var res = '';
        var f1 = function() { var p1 = p(); p1.resolve(); res += 'p1'; return p1; }
        var f2 = function() { var p2 = p(); p2.resolve(); res += 'p2'; return p2; }
        var f3 = function() { var p3 = p(); p3.resolve(); res += 'p3'; return p3; }

        f1()
            .then(f2)
            .then(f3)
            .then(function() {
                expect(res).to.eql('p1p2p3');
                done();
            });
    });

    it('should chain promises right order', function(done) {
        var res = '';
        var f1 = function() { var p1 = p(); setTimeout(function() {p1.resolve();}, 40); res += 'p1'; return p1; }
        var f2 = function() { var p2 = p(); setTimeout(function() {p2.resolve();}, 20); res += 'p2'; return p2; }
        var f3 = function() { var p3 = p(); setTimeout(function() {p3.resolve();}, 10); res += 'p3'; return p3; }

        f1()
            .then(f2)
            .then(f3)
            .then(function() {
                expect(res).to.eql('p1p2p3');
                done();
            });
    });

    it('should chain resolutions', function(done) {
        var f1 = function(   ) { var p1 = p(); setTimeout(function() {p1.resolve(      'p1');}, 40); return p1; }
        var f2 = function(res) { var p2 = p(); setTimeout(function() {p2.resolve(res + 'p2');}, 20); return p2; }
        var f3 = function(res) { var p3 = p(); setTimeout(function() {p3.resolve(res + 'p3');}, 10); return p3; }

        f1()
            .then(f2)
            .then(f3)
            .then(function(res) {
                expect(res).to.eql('p1p2p3');
                done();
            });
    });

    it('should pass reject by chain without execution', function(done) {
        var f1 = function(   ) { var p1 = p(); p1.reject(       'p1'); return p1; }
        var f2 = function(res) { var p2 = p(); expect(2).to.be(3); p2.resolve(res + 'p2'); return p2; }
        var f3 = function(res) { var p3 = p(); expect(2).to.be(3); p3.resolve(res + 'p3'); return p3; }

        f1()
            .then(f2)
            .then(f3)
            .esle(function(err) {
                expect(err).to.eql('p1');
                done();
            })
    });

    it('should pass reject by chain without execution async', function(done) {
        var f1 = function(   ) { var p1 = p(); setTimeout(function() {p1.reject(       'p1');}, 40); return p1; }
        var f2 = function(res) { var p2 = p(); setTimeout(function() {expect(2).to.be(3);p2.resolve(res + 'p2');}, 20); return p2; }
        var f3 = function(res) { var p3 = p(); setTimeout(function() {expect(2).to.be(3);p3.resolve(res + 'p3');}, 10); return p3; }

        f1()
            .then(f2)
            .then(f3)
            .esle(function(res) {
                expect(res).to.eql('p1');
                done();
            });
    });

    it('should execute all esles in the chain', function(done) {
        var res = '';
        var f1 = function(   ) { var p1 = p(); p1.reject(       'p1'); return p1; }
        var f2 = function(res) { var p2 = p(); expect(2).to.be(3); p2.resolve(res + 'p2'); return p2; }
        var f3 = function(res) { var p3 = p(); expect(2).to.be(3); p3.resolve(res + 'p3'); return p3; }

        f1()
            .then(f2)
            .esle(function(val) {
                res += val;
            })
            .then(f3)
            .esle(function(val) {
                res += val
                expect(res).to.eql('p1p1');
                done();
            });
    });

    it('should execute all esles in the chain async', function(done) {
        var res = '';
        var f1 = function(   ) { var p1 = p(); setTimeout(function() {p1.reject(       'p1');}, 40); return p1; }
        var f2 = function(res) { var p2 = p(); setTimeout(function() {expect(2).to.be(3); p2.resolve(res + 'p2');}, 20); return p2; }
        var f3 = function(res) { var p3 = p(); setTimeout(function() {expect(2).to.be(3); p3.resolve(res + 'p3');}, 10); return p3; }

        f1()
            .then(f2)
            .esle(function(val) {
                res += val;
            })
            .then(f3)
            .esle(function(val) {
                res += val
                expect(res).to.eql('p1p1');
                done();
            });
    });

    it('should pipe promise', function(done) {
        var p1 = p();
        var p2 = p();

        p2.then(function(data) {
            expect(data).to.eql(2);
            done();
        });

        p1.pipe(p2);

        p1.resolve(2);
    });
});
