export const SETUP_CONJUNCTIONS = [
  'given',
  'when',
  'where',
  'while',
  'with',
  'and',
  'or',
  'after',
  'once',
];

export const TEST_CONJUNCTIONS = [
  'then',
  'and',
];

export const DETERMINERS = [
  'the',
  'a',
  'an',
];

export const PENDING_MODIFIERS = [
  'skip',
  'pending',
  'eventually',
];

export const ONLY_MODIFIERS = [
  'only',
  'just',
  'exclusive',
];

export const FUNC_REGEX =
  new RegExp('^function[^(]*\\(([^)]*)\\)\\s*{([^]*)}$');
export const LONG_ARROW_REGEX =
  new RegExp('^\\(([^)]*)\\)\\s*=>\\s*{([^]*)}$');
export const SHORT_ARROW_REGEX =
  new RegExp('^\\(([^)]*)\\)\\s*=>\\s*([^]*)$');
export const ASYNC_ARGS_REGEX =
  new RegExp('^[^]*,[^{}[\\]]*$');
export const RETURN_REGEX =
  new RegExp('^return\\s+(.*?);?$');
