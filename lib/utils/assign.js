'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assign = assign;
// define our own assign method
// rather than polyfill, this way we
// don't change the global environment
// in browsers (which could invalidate
// tests)

function assign(object) {
  for (var _len = arguments.length, changes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    changes[_key - 1] = arguments[_key];
  }

  changes.forEach(function (change) {
    if (typeof change !== 'undefined') {
      Object.keys(change).forEach(function (key) {
        object[key] = change[key];
      });
    }
  });
  return object;
}