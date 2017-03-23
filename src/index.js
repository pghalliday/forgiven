import {
  resolveSetupParams,
  resolveTestParams,
} from './utils/args';
import {
  assign,
} from './utils/assign';
import {
  SETUP_CONJUNCTIONS,
  TEST_CONJUNCTIONS,
  DETERMINERS,
  ONLY_MODIFIERS,
  PENDING_MODIFIERS,
} from './constants';

export {
  SETUP_CONJUNCTIONS,
  TEST_CONJUNCTIONS,
  DETERMINERS,
  ONLY_MODIFIERS,
  PENDING_MODIFIERS,
};

export {
  descriptionFromFuncStr,
} from './utils/description-from-func-str.js';

const CHAINED_PREFIX = '__prefix';
const CHAINED_UI = '__ui';
const CHAINED_SETUPS = '__setups';
const CHAINED_TESTS = '__tests';
const CHAINED_FORK = '__fork';
const CHAINED_PENDING = '__pending';
const CHAINED_ONLY = '__only';

function copyChain(chain, ...changes) {
  return assign({}, {
    [CHAINED_PREFIX]: chain[CHAINED_PREFIX],
    [CHAINED_UI]: chain[CHAINED_UI],
    [CHAINED_SETUPS]: chain[CHAINED_SETUPS],
    [CHAINED_TESTS]: chain[CHAINED_TESTS],
    [CHAINED_FORK]: chain[CHAINED_FORK],
    [CHAINED_PENDING]: chain[CHAINED_PENDING],
    [CHAINED_ONLY]: chain[CHAINED_ONLY],
  }, ...changes);
};

function bindMethod(name, method, chain, changes) {
  const newChain = copyChain(chain, {
    [CHAINED_PREFIX]: chain[CHAINED_PREFIX] + name + ' ',
  }, changes);
  const newMethod = method.bind(newChain);
  // also add the chained properties to
  // the method so that it can be used as
  // an object for chaining grammar
  assign(newMethod, newChain);
  return newMethod;
};

function bindProperty(name, chain) {
  const newChain = copyChain(chain, {
    [CHAINED_PREFIX]: chain[CHAINED_PREFIX] + name + ' ',
  });
  return newChain;
};

function createParams(prefix, pending, only, params) {
  return assign({}, params, {
    description: prefix + params.description,
    pending,
    only,
  });
}

function end() {
  // eslint-disable-next-line no-invalid-this
  if (this[CHAINED_FORK] > 0) {
    throw(new Error('end cannot be called inside fork'));
  }
  // eslint-disable-next-line no-invalid-this
  return this[CHAINED_UI]();
}

function uiTest(params, chainedTests) {
  chainedTests.push(params);
}

export function create(uiFactory, plugins) {
  function uiSetup(params, ui, chainedSetups) {
    const setups = [];
    const tests = [];
    const callback = (setup, test) => {
      tests.forEach((params) => {
        test(params);
      });
      setups.forEach((params) => {
        setup(params.params, params.callback);
      });
    };
    if (ui) {
      chainedSetups.push({
        params,
        callback,
      });
    } else {
      ui = uiFactory(params, callback);
    }
    return [ui, setups, tests];
  }

  function testStep(...args) {
    const params = createParams(
      // eslint-disable-next-line no-invalid-this
      this[CHAINED_PREFIX],
      // eslint-disable-next-line no-invalid-this
      this[CHAINED_PENDING],
      // eslint-disable-next-line no-invalid-this
      this[CHAINED_ONLY],
      resolveTestParams(...args),
    );
    uiTest(
      params,
      // eslint-disable-next-line no-invalid-this
      this[CHAINED_TESTS],
    );
    // eslint-disable-next-line no-invalid-this
    const chain = copyChain(this, {
      [CHAINED_PREFIX]: '',
      [CHAINED_PENDING]: false,
      [CHAINED_ONLY]: false,
    });
    TEST_CONJUNCTIONS.forEach((conjunction) => {
      addTestConjunction(conjunction, chain);
    });
    chain.end = end.bind(chain);
    return chain;
  }

  function setupStep(...args) {
    const params = createParams(
      // eslint-disable-next-line no-invalid-this
      this[CHAINED_PREFIX],
      // eslint-disable-next-line no-invalid-this
      this[CHAINED_PENDING],
      // eslint-disable-next-line no-invalid-this
      this[CHAINED_ONLY],
      resolveSetupParams(...args),
    );
    const [ui, setups, tests] = uiSetup(
      params,
      // eslint-disable-next-line no-invalid-this
      this[CHAINED_UI],
      // eslint-disable-next-line no-invalid-this
      this[CHAINED_SETUPS],
    );
    // eslint-disable-next-line no-invalid-this
    const chain = copyChain(this, {
      [CHAINED_PREFIX]: '',
      [CHAINED_UI]: ui,
      [CHAINED_SETUPS]: setups,
      [CHAINED_TESTS]: tests,
      [CHAINED_PENDING]: false,
      [CHAINED_ONLY]: false,
    });
    SETUP_CONJUNCTIONS.forEach((conjunction) => {
      addSetupConjunction(conjunction, chain);
    });
    chain.fork = (callback) => {
      chain[CHAINED_FORK]++;
      callback(chain);
      chain[CHAINED_FORK]--;
      return chain;
    };
    chain.end = end.bind(chain);
    addTestConjunction('then', chain);
    return chain;
  }

  function addPlugins(chain) {
    if (plugins) {
      Object.keys(plugins).forEach((plugin) => {
        chain[plugin] = plugins[plugin](bindMethod(
          plugin,
          setupStep,
          chain,
        ));
      });
    }
  }

  function addDeterminer(determiner, chain) {
    chain[determiner] = bindProperty(determiner, chain);
    addPlugins(chain[determiner]);
  };

  function addConjunction(
    conjunction,
    chain,
    step,
    conjunctions,
    determiners,
    changes,
  ) {
    Object.defineProperty(chain, conjunction, {
      get: () => {
        const conjunctionMethod = bindMethod(conjunction, step, chain, changes);
        conjunctions.forEach((chainedConjunction) => {
          addConjunction(
            chainedConjunction,
            conjunctionMethod,
            step,
            conjunctions,
            determiners
          );
        });
        determiners.forEach((determiner) => {
          addDeterminer(determiner, conjunctionMethod);
        });
        PENDING_MODIFIERS.forEach((modifier) => {
          addConjunction(
            modifier,
            conjunctionMethod,
            step,
            conjunctions,
            determiners, {
              [CHAINED_PENDING]: true,
            }
          );
        });
        ONLY_MODIFIERS.forEach((modifier) => {
          addConjunction(
            modifier,
            conjunctionMethod,
            step,
            conjunctions,
            determiners, {
              [CHAINED_ONLY]: true,
            }
          );
        });
        return conjunctionMethod;
      },
    });
  }

  function addTestConjunction(conjunction, chain) {
    addConjunction(
      conjunction,
      chain,
      testStep,
      TEST_CONJUNCTIONS,
      [],
    );
  }

  function addSetupConjunction(conjunction, chain) {
    addConjunction(
      conjunction,
      chain,
      setupStep,
      SETUP_CONJUNCTIONS,
      DETERMINERS,
    );
  }

  const chain = {
    [CHAINED_PREFIX]: '',
    [CHAINED_FORK]: 0,
    [CHAINED_PENDING]: false,
    [CHAINED_ONLY]: false,
  };
  addSetupConjunction('given', chain);
  return chain.given;
}
