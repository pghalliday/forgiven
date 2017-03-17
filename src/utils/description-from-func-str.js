import {
  FUNC_REGEX,
  LONG_ARROW_REGEX,
  SHORT_ARROW_REGEX,
} from '../constants';

export function descriptionFromFuncStr(funcStr) {
  let match = FUNC_REGEX.exec(funcStr);
  if (match === null) {
    match = LONG_ARROW_REGEX.exec(funcStr);
  }
  if (match === null) {
    match = SHORT_ARROW_REGEX.exec(funcStr);
  }
  if (match !== null) {
    return '`' + match[2].trim() + '`';
  }
}
