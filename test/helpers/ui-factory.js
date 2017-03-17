/*
 * Usage:
 *
 *  ui(createSetup('setup 1'), (setup, test) => {
 *    test(createTest('test 1/1'));
 *    setup(createSetup('setup 1/1'), (setup, test) => {
 *      test(createTest('test 1/1/1'));
 *      setup(createSetup('setup 1/1/1'), (setup, test) => {
 *       ...
 *      });
 *    });
 *  });
 *
 * Will return something that looks like this
 *
 *  {
 *    // there will only be one top level setup
 *    description: '...',
 *    beforeEach: 'beforeEach: ...',
 *    afterEach: 'afterEach: ...',
 *    // multiple setup entries from now on
 *    setup: [{
 *      description: '...',
 *      beforeEach: 'beforeEach: ...',
 *      afterEach: 'afterEach: ...',
 *      setup: [
 *        ...
 *      ],
 *      test: [
 *        ...
 *      ],
 *    }, {
 *      ...
 *    }],
 *    // multiple test entries
 *    test: [{
 *      description: '...',
 *      test: 'test: ...',
 *    }, {
 *      ...
 *    }],
 *  }
 *
 */

import _ from 'lodash';

function resolveSetup({
  description,
  beforeEach,
  afterEach,
  pending,
  only,
}, callback, object) {
  Object.assign(object, {
    setup: [],
    test: [],
    description,
    beforeEach: beforeEach(),
    afterEach: afterEach(),
    pending,
    only,
  });
  callback(
    setup.bind(object),
    test.bind(object),
  );
  return object;
}

function resolveTest({description, test, pending, only}, object) {
  return Object.assign(object, {
    description,
    test: test(),
    pending,
    only,
  });
}

function setup(params, callback) {
  // eslint-disable-next-line no-invalid-this
  this.setup.push(resolveSetup(params, callback, {}));
}

function test(params) {
  // eslint-disable-next-line no-invalid-this
  this.test.push(resolveTest(params, {}));
}

export function createSetup(description) {
  return {
    description,
    beforeEach: () => `beforeEach: ${description}`,
    afterEach: () => `afterEach: ${description}`,
  };
}

export function createTest(description) {
  return {
    description,
    test: () => `test: ${description}`,
  };
}

export function uiFactory(params, callback) {
  return function() {
    return resolveSetup(params, callback, {});
  };
}
