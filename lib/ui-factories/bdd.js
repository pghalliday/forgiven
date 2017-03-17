"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bdd = bdd;
function setup(_ref, callback) {
  var description = _ref.description,
      beforeEachCallback = _ref.beforeEach,
      afterEachCallback = _ref.afterEach;

  describe(description, function () {
    if (beforeEachCallback) {
      beforeEach(beforeEachCallback);
    }
    if (afterEachCallback) {
      afterEach(afterEachCallback);
    }
    callback(setup, test);
  });
}

function test(_ref2) {
  var description = _ref2.description,
      test = _ref2.test;

  it(description, test);
}

function bdd(params, callback) {
  return function () {
    setup(params, callback);
  };
}