'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PENDING_MODIFIERS = exports.ONLY_MODIFIERS = exports.DETERMINERS = exports.TEST_CONJUNCTIONS = exports.SETUP_CONJUNCTIONS = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.create = create;

var _args = require('./utils/args');

var _constants = require('./constants');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.SETUP_CONJUNCTIONS = _constants.SETUP_CONJUNCTIONS;
exports.TEST_CONJUNCTIONS = _constants.TEST_CONJUNCTIONS;
exports.DETERMINERS = _constants.DETERMINERS;
exports.ONLY_MODIFIERS = _constants.ONLY_MODIFIERS;
exports.PENDING_MODIFIERS = _constants.PENDING_MODIFIERS;


var CHAINED_PREFIX = '__prefix';
var CHAINED_UI = '__ui';
var CHAINED_SETUPS = '__setups';
var CHAINED_TESTS = '__tests';
var CHAINED_FORK = '__fork';
var CHAINED_PENDING = '__pending';
var CHAINED_ONLY = '__only';

function copyChain(chain) {
  var _ref;

  for (var _len = arguments.length, changes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    changes[_key - 1] = arguments[_key];
  }

  return Object.assign.apply(Object, [{}, (_ref = {}, _defineProperty(_ref, CHAINED_PREFIX, chain[CHAINED_PREFIX]), _defineProperty(_ref, CHAINED_UI, chain[CHAINED_UI]), _defineProperty(_ref, CHAINED_SETUPS, chain[CHAINED_SETUPS]), _defineProperty(_ref, CHAINED_TESTS, chain[CHAINED_TESTS]), _defineProperty(_ref, CHAINED_FORK, chain[CHAINED_FORK]), _defineProperty(_ref, CHAINED_PENDING, chain[CHAINED_PENDING]), _defineProperty(_ref, CHAINED_ONLY, chain[CHAINED_ONLY]), _ref)].concat(changes));
};

function bindMethod(name, method, chain, changes) {
  var newChain = copyChain(chain, _defineProperty({}, CHAINED_PREFIX, chain[CHAINED_PREFIX] + name + ' '), changes);
  var newMethod = method.bind(newChain);
  // also add the chained properties to
  // the method so that it can be used as
  // an object for chaining grammar
  Object.assign(newMethod, newChain);
  return newMethod;
};

function bindProperty(name, chain) {
  var newChain = copyChain(chain, _defineProperty({}, CHAINED_PREFIX, chain[CHAINED_PREFIX] + name + ' '));
  return newChain;
};

function createParams(prefix, pending, only, params) {
  return Object.assign({}, params, {
    description: prefix + params.description,
    pending: pending,
    only: only
  });
}

function end() {
  // eslint-disable-next-line no-invalid-this
  if (this[CHAINED_FORK] > 0) {
    throw new Error('end cannot be called inside fork');
  }
  // eslint-disable-next-line no-invalid-this
  return this[CHAINED_UI]();
}

function uiTest(params, chainedTests) {
  chainedTests.push(params);
}

function create(uiFactory, plugins) {
  var _chain;

  function uiSetup(params, ui, chainedSetups) {
    var setups = [];
    var tests = [];
    var callback = function callback(setup, test) {
      tests.forEach(function (params) {
        test(params);
      });
      setups.forEach(function (params) {
        setup(params.params, params.callback);
      });
    };
    if (ui) {
      chainedSetups.push({
        params: params,
        callback: callback
      });
    } else {
      ui = uiFactory(params, callback);
    }
    return [ui, setups, tests];
  }

  function testStep() {
    var _copyChain3;

    var params = createParams(
    // eslint-disable-next-line no-invalid-this
    this[CHAINED_PREFIX],
    // eslint-disable-next-line no-invalid-this
    this[CHAINED_PENDING],
    // eslint-disable-next-line no-invalid-this
    this[CHAINED_ONLY], _args.resolveTestParams.apply(undefined, arguments));
    uiTest(params,
    // eslint-disable-next-line no-invalid-this
    this[CHAINED_TESTS]);
    // eslint-disable-next-line no-invalid-this
    var chain = copyChain(this, (_copyChain3 = {}, _defineProperty(_copyChain3, CHAINED_PREFIX, ''), _defineProperty(_copyChain3, CHAINED_PENDING, false), _defineProperty(_copyChain3, CHAINED_ONLY, false), _copyChain3));
    _constants.TEST_CONJUNCTIONS.forEach(function (conjunction) {
      addTestConjunction(conjunction, chain);
    });
    chain.end = end.bind(chain);
    return chain;
  }

  function setupStep() {
    var _copyChain4;

    var params = createParams(
    // eslint-disable-next-line no-invalid-this
    this[CHAINED_PREFIX],
    // eslint-disable-next-line no-invalid-this
    this[CHAINED_PENDING],
    // eslint-disable-next-line no-invalid-this
    this[CHAINED_ONLY], _args.resolveSetupParams.apply(undefined, arguments));

    var _uiSetup = uiSetup(params,
    // eslint-disable-next-line no-invalid-this
    this[CHAINED_UI],
    // eslint-disable-next-line no-invalid-this
    this[CHAINED_SETUPS]),
        _uiSetup2 = _slicedToArray(_uiSetup, 3),
        ui = _uiSetup2[0],
        setups = _uiSetup2[1],
        tests = _uiSetup2[2];
    // eslint-disable-next-line no-invalid-this


    var chain = copyChain(this, (_copyChain4 = {}, _defineProperty(_copyChain4, CHAINED_PREFIX, ''), _defineProperty(_copyChain4, CHAINED_UI, ui), _defineProperty(_copyChain4, CHAINED_SETUPS, setups), _defineProperty(_copyChain4, CHAINED_TESTS, tests), _defineProperty(_copyChain4, CHAINED_PENDING, false), _defineProperty(_copyChain4, CHAINED_ONLY, false), _copyChain4));
    _constants.SETUP_CONJUNCTIONS.forEach(function (conjunction) {
      addSetupConjunction(conjunction, chain);
    });
    chain.fork = function (callback) {
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
      Object.keys(plugins).forEach(function (plugin) {
        chain[plugin] = plugins[plugin](bindMethod(plugin, setupStep, chain));
      });
    }
  }

  function addDeterminer(determiner, chain) {
    chain[determiner] = bindProperty(determiner, chain);
    addPlugins(chain[determiner]);
  };

  function addConjunction(conjunction, chain, step, conjunctions, determiners, changes) {
    Object.defineProperty(chain, conjunction, {
      get: function get() {
        var conjunctionMethod = bindMethod(conjunction, step, chain, changes);
        conjunctions.forEach(function (chainedConjunction) {
          addConjunction(chainedConjunction, conjunctionMethod, step, conjunctions, determiners);
        });
        determiners.forEach(function (determiner) {
          addDeterminer(determiner, conjunctionMethod);
        });
        _constants.PENDING_MODIFIERS.forEach(function (modifier) {
          addConjunction(modifier, conjunctionMethod, step, conjunctions, determiners, _defineProperty({}, CHAINED_PENDING, true));
        });
        _constants.ONLY_MODIFIERS.forEach(function (modifier) {
          addConjunction(modifier, conjunctionMethod, step, conjunctions, determiners, _defineProperty({}, CHAINED_ONLY, true));
        });
        return conjunctionMethod;
      }
    });
  }

  function addTestConjunction(conjunction, chain) {
    addConjunction(conjunction, chain, testStep, _constants.TEST_CONJUNCTIONS, []);
  }

  function addSetupConjunction(conjunction, chain) {
    addConjunction(conjunction, chain, setupStep, _constants.SETUP_CONJUNCTIONS, _constants.DETERMINERS);
  }

  var chain = (_chain = {}, _defineProperty(_chain, CHAINED_PREFIX, ''), _defineProperty(_chain, CHAINED_FORK, 0), _defineProperty(_chain, CHAINED_PENDING, false), _defineProperty(_chain, CHAINED_ONLY, false), _chain);
  addSetupConjunction('given', chain);
  return chain.given;
}