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

    it('should fire multiple callbacks', function() {
        var count = '';
        this.promise.then(function() { count+='a'; });
        this.promise.then(function() { count+='b'; });

        this.promise.resolve();

        expect(count).to.eql('ab');
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

});
