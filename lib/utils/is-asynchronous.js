'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAsynchronous = isAsynchronous;

var _constants = require('../constants');

function isAsynchronous(funcStr) {
  var match = _constants.FUNC_REGEX.exec(funcStr);
  if (match === null) {
    match = _constants.LONG_ARROW_REGEX.exec(funcStr);
  }
  if (match === null) {
    match = _constants.SHORT_ARROW_REGEX.exec(funcStr);
  }
  if (match !== null) {
    return _constants.ASYNC_ARGS_REGEX.test(match[1]);
  }
  return false;
}