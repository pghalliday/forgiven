'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.descriptionFromFunc = descriptionFromFunc;

var _constants = require('../constants');

function descriptionFromFunc(func) {
  var funcStr = func.toString();
  var match = _constants.FUNC_REGEX.exec(funcStr);
  if (match === null) {
    match = _constants.LAMBDA_LONG_REGEX.exec(funcStr);
  }
  if (match === null) {
    match = _constants.LAMBDA_SHORT_REGEX.exec(funcStr);
  }
  if (match !== null) {
    return '`' + match[2].trim() + '`';
  }
}