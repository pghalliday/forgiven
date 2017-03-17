import {
  descriptionFromFuncStr,
} from '../../../src/utils/description-from-func-str';

const regularFunction = `function regularFunction(message) {
  console.log(message);
}`;

const anonymousFunction = `function(message) {
  console.log(message);
}`;

const longArrow = `(message) => {
  console.log(message);
}`;

const shortArrow = `(message) => console.log(message)`;

const notAFunction = 'not a function';

describe('utils', () => {
  describe('descriptionFromFuncStr', () => {
    it('should handle regular functions', () => {
      descriptionFromFuncStr(regularFunction).should.eql(
        '`console.log(message);`'
      );
    });

    it('should handle anonymous functions', () => {
      descriptionFromFuncStr(anonymousFunction).should.eql(
        '`console.log(message);`'
      );
    });

    it('should handle long form arrow functions', () => {
      descriptionFromFuncStr(longArrow).should.eql(
        '`console.log(message);`'
      );
    });

    it('should handle short form arrow functions', () => {
      descriptionFromFuncStr(shortArrow).should.eql(
        '`console.log(message)`'
      );
    });

    it('should return undefined for non functions', () => {
      expect(descriptionFromFuncStr(notAFunction)).to.be.undefined;
    });
  });
});
