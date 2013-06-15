/**
 * Unit tests for node dice module.
 */
//var assert = require('assert');
var ROLE = require('../lib/dice');	// module to test
require('should');

// the describe function is a way to group tests
describe("Dice Module:", function () {
	describe("d6", function () {
		// actual test
		it("should return a value between 1 and 6.", function () {
			ROLE.d6().should.be.within(1, 6);
		});
	});
	describe("d20", function () {
		// actual test
		it("should return a value between 1 and 20.", function () {
			ROLE.d20().should.be.within(1, 20);
		});
	});
	describe("dX", function () {
		it("should return 0 if x = 0", function () {
			ROLE.dX(0).should.equal(0);
		});
		it("should return 0 for negative numbers", function () {
			ROLE.dX(-1).should.equal(0);
		});
		it("should return 0 for x values that aren't numbers.", function () {
			ROLE.dX(-100).should.equal(0);
		});
		it("should return 0 for mixxing x values", function () {
			ROLE.dX().should.equal(0);
		});
		it("should round off x if it's a real number. eg 3.5", function () {
			var i = 0;
			for (i = 0; i < 1000; i++) {
				ROLE.dX(3.5).should.be.within(1, 3);
			}
		});
	});
	
}); 
