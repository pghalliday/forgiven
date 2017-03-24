'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.descriptionFromFuncStr = descriptionFromFuncStr;

var _constants = require('../constants');

function descriptionFromFuncStr(funcStr) {
  var match = _constants.FUNC_REGEX.exec(funcStr);
  if (match === null) {
    match = _constants.LONG_ARROW_REGEX.exec(funcStr);
  }
  if (match === null) {
    match = _constants.SHORT_ARROW_REGEX.exec(funcStr);
  }
  if (match !== null) {
    var description = match[2].trim();
    match = _constants.RETURN_REGEX.exec(description);
    if (match !== null) {
      description = match[1].trim();
    }
    return '`' + description + '`';
  }
}