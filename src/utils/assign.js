// define our own assign method
// rather than polyfill, this way we
// don't change the global environment
// in browsers (which could invalidate
// tests)

export function assign(object, ...changes) {
  changes.forEach((change) => {
    if (typeof change !== 'undefined') {
      Object.keys(change).forEach((key) => {
        object[key] = change[key];
      });
    }
  });
  return object;
}
