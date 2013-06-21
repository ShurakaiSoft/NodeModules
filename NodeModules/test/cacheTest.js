/**
 * Unit tests for node cache module.
 */

var should = require('should');
var cache = require('../lib/cache');

var asyncDelay = 100;
var shortTtl = 500;
var longTtl = 5000;


describe("Cache Module:", function () {
	var keys = ['a','b', 'd'];
	var values = {
			a: 'alpha',
			b: 'beta',
			d: 'delta',
			e: 'echo'
	};
	var shortTtlCache = cache.init({
		addFunc: function (key, callback) {
			setTimeout(function () {
				callback(null, values[key]);
			}, asyncDelay);
		},
		ttl: shortTtl
	});
	var longTtlCache = cache.init({
		addFunc: function (key, callback) {
			setTimeout(function () {
				callback(null, values[key]);
			}, asyncDelay);
		},
		ttl: longTtl
	});
	
	describe("init cache", function () {
		it("should be an object", function () {
			shortTtlCache.should.be.a('object');
		});
		it("should have a fetch function", function () {
			shortTtlCache.should.have.ownProperty('fetch');
		});
	});
	describe("fetch() method", function () {
		it("should be a function", function () {
			shortTtlCache.fetch.should.be.a('function');
		});
		it("should return the correct value", function (done) {
			shortTtlCache.fetch(keys[0], function (err, value) {
				should.not.exist(err);
				should.exist(value);
				value.should.equal(values[keys[0]]);
				done();
			});
		});
		it("should return the correct value", function (done) {
			shortTtlCache.fetch(keys[1], function (err, value) {
				should.not.exist(err);
				should.exist(value);
				value.should.equal(values[keys[1]]);
				done();
			});
		});
		it("should fail for non values", function (done) {
			shortTtlCache.fetch('c', function (err, value) {
				should.not.exist(err);
				should.not.exist(value);
				done();
			});
		});
	});
	describe("Values are being cached.", function () {
		var start = Date.now();
		var end = 0;
		it("First fetch should take a long time", function (done) {
			shortTtlCache.fetch('d', function (err, value) {
				value.should.equal(values.d);
				end = Date.now();
				(end - start).should.be.above(asyncDelay);
				done();
			});
		});
		it("Second fetch should be quick (cached)", function (done) {
			this.timeout(asyncDelay);
			shortTtlCache.fetch('d', function (err, value) {
				value.should.equal(values.d);
				done();
			});
		});
	});
	describe("TTL cleans out old cache values", function () {
		var start = Date.now();
		var end = 0;
		it("First fetch should take a long time", function (done) {
			shortTtlCache.fetch('e', function (err, value) {
				value.should.equal(values.e);
				end = Date.now();
				(end - start).should.be.above(asyncDelay);
				done();
			});
		});
		it("Second fetch should be quick (cached)", function (done) {
			this.timeout(asyncDelay);
			shortTtlCache.fetch('e', function (err, value) {
				value.should.equal(values.e);
				done();
			});
		});
		it("Third fetch should take a long time, (cleanded from cache)", function (done) {
			setTimeout(function () {
				start = Date.now();
				shortTtlCache.fetch('e', function (err, value) {
					value.should.equal(values.e);
					end = Date.now();
					(end - start).should.be.above(asyncDelay);
					done();
				});
			}, shortTtl * 2);
		});
		start = Date.now();
		it("First fetch should take a long time", function (done) {
			longTtlCache.fetch('e', function (err, value) {
				value.should.equal(values.e);
				end = Date.now();
				(end - start).should.be.above(asyncDelay);
				done();
			});
		});
		it("Second fetch should be quick (cached)", function (done) {
			this.timeout(asyncDelay);
			longTtlCache.fetch('e', function (err, value) {
				value.should.equal(values.e);
				done();
			});
		});
		it("Third fetch should take a long time, (cleanded from cache)", function (done) {
			setTimeout(function () {
				start = Date.now();
				longTtlCache.fetch('e', function (err, value) {
					value.should.equal(values.e);
					end = Date.now();
					(end - start).should.be.below(asyncDelay);
					done();
				});
			}, shortTtl * 2);
		});
	});
});