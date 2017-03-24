'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SETUP_CONJUNCTIONS = exports.SETUP_CONJUNCTIONS = ['given', 'when', 'where', 'while', 'with', 'and', 'or', 'after', 'once'];

var TEST_CONJUNCTIONS = exports.TEST_CONJUNCTIONS = ['then', 'and'];

var DETERMINERS = exports.DETERMINERS = ['the', 'a', 'an'];

var PENDING_MODIFIERS = exports.PENDING_MODIFIERS = ['skip', 'pending', 'eventually'];

var ONLY_MODIFIERS = exports.ONLY_MODIFIERS = ['only', 'just', 'exclusive'];

var FUNC_REGEX = exports.FUNC_REGEX = new RegExp('^function[^(]*\\(([^)]*)\\)\\s*{([^]*)}$');
var LONG_ARROW_REGEX = exports.LONG_ARROW_REGEX = new RegExp('^\\(([^)]*)\\)\\s*=>\\s*{([^]*)}$');
var SHORT_ARROW_REGEX = exports.SHORT_ARROW_REGEX = new RegExp('^\\(([^)]*)\\)\\s*=>\\s*([^]*)$');
var ASYNC_ARGS_REGEX = exports.ASYNC_ARGS_REGEX = new RegExp('^[^]*,[^{}[\\]]*$');
var RETURN_REGEX = exports.RETURN_REGEX = new RegExp('^return\\s+(.*?);?$');