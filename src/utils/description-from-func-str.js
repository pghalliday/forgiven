import {
  FUNC_REGEX,
  LONG_ARROW_REGEX,
  SHORT_ARROW_REGEX,
  RETURN_REGEX,
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
    let description = match[2].trim();
    match = RETURN_REGEX.exec(description);
    if (match !== null) {
      description = match[1].trim();
    }
    return '`' + description + '`';
  }
}
