'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.resolveSetupParams = resolveSetupParams;
exports.resolveTestParams = resolveTestParams;

var _descriptionFromFuncStr = require('./description-from-func-str');

function resolveSetupParams(description, beforeEach, afterEach) {
  if (typeof description === 'function') {
    afterEach = beforeEach;
    beforeEach = description;
    description = undefined;
  }
  var params = (typeof description === 'undefined' ? 'undefined' : _typeof(description)) === 'object' ? description : {
    description: description,
    beforeEach: beforeEach,
    afterEach: afterEach
  };
  if (typeof params.description === 'undefined') {
    if (typeof params.beforeEach === 'undefined') {
      throw new Error('neither description or beforeEach specified');
    }
    params.description = (0, _descriptionFromFuncStr.descriptionFromFuncStr)(params.beforeEach);
  };
  if (typeof params.beforeEach === 'undefined') {
    delete params.beforeEach;
  }
  if (typeof params.afterEach === 'undefined') {
    delete params.afterEach;
  }
  return params;
}

function resolveTestParams(description, test) {
  if (typeof description === 'function') {
    test = description;
    description = undefined;
  }
  var params = (typeof description === 'undefined' ? 'undefined' : _typeof(description)) === 'object' ? description : {
    description: description,
    test: test
  };
  if (typeof params.test !== 'function') {
    throw new Error('test not specified');
  }
  if (typeof params.description === 'undefined') {
    params.description = (0, _descriptionFromFuncStr.descriptionFromFuncStr)(params.test);
  };
  return params;
}