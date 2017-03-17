"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mocha = mocha;
function getFunction(base, _ref) {
  var pending = _ref.pending,
      only = _ref.only;

  if (pending) {
    return base.skip;
  } else if (only) {
    return base.only;
  }
  return base;
}

function setup(_ref2, callback) {
  var description = _ref2.description,
      beforeEachCallback = _ref2.beforeEach,
      afterEachCallback = _ref2.afterEach,
      pending = _ref2.pending,
      only = _ref2.only;

  getFunction(describe, { pending: pending, only: only })(description, function () {
    if (beforeEachCallback) {
      beforeEach(beforeEachCallback);
    }
    if (afterEachCallback) {
      afterEach(afterEachCallback);
    }
    callback(setup, test);
  });
}

function test(_ref3) {
  var description = _ref3.description,
      test = _ref3.test,
      pending = _ref3.pending,
      only = _ref3.only;

  getFunction(it, { pending: pending, only: only })(description, test);
}

function mocha(params, callback) {
  return function () {
    setup(params, callback);
  };
}