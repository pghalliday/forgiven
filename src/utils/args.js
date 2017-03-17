import {
  descriptionFromFuncStr,
} from './description-from-func-str';

export function resolveSetupParams(description, beforeEach, afterEach) {
  if (typeof description === 'function') {
    afterEach = beforeEach;
    beforeEach = description;
    description = undefined;
  }
  const params = typeof description === 'object' ? description : {
    description,
    beforeEach,
    afterEach,
  };
  if (typeof params.description === 'undefined') {
    if (typeof params.beforeEach === 'undefined') {
      throw new Error('neither description or beforeEach specified');
    }
    params.description = descriptionFromFuncStr(params.beforeEach);
  };
  if (typeof params.beforeEach === 'undefined') {
    delete params.beforeEach;
  }
  if (typeof params.afterEach === 'undefined') {
    delete params.afterEach;
  }
  return params;
}

export function resolveTestParams(description, test) {
  if (typeof description === 'function') {
    test = description;
    description = undefined;
  }
  const params = typeof description === 'object' ? description : {
    description,
    test,
  };
  if (typeof params.test !== 'function') {
    throw new Error('test not specified');
  }
  if (typeof params.description === 'undefined') {
    params.description = descriptionFromFuncStr(params.test);
  };
  return params;
}
