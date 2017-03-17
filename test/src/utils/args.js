import {
  resolveSetupParams,
  resolveTestParams,
} from '../../../src/utils/args';
import {
  descriptionFromFuncStr,
} from '../../../src/utils/description-from-func-str';
import _ from 'lodash';

const description = 'description';
const beforeEach = () => 'beforeEach';
const afterEach = () => 'afterEach';
const test = () => 'test';

describe('utils', () => {
  describe('args', () => {
    describe('resolveSetupParams', () => {
      _.forEach({
        'with an object for the first argument': {
          all: resolveSetupParams({description, beforeEach, afterEach}),
          beforeAfter: resolveSetupParams({beforeEach, afterEach}),
          before: resolveSetupParams({beforeEach}),
          descriptionBefore: resolveSetupParams({description, beforeEach}),
          description: resolveSetupParams({description}),
          none: () => resolveSetupParams({}),
        },
        'with individual arguments': {
          all: resolveSetupParams(description, beforeEach, afterEach),
          beforeAfter: resolveSetupParams(beforeEach, afterEach),
          before: resolveSetupParams(beforeEach),
          descriptionBefore: resolveSetupParams(description, beforeEach),
          description: resolveSetupParams(description),
          none: () => resolveSetupParams(),
        },
      }, (value, key) => {
        describe(key, () => {
          describe('with a description, beforeEach and afterEach', () => {
            it('should correctly assign the object', () => {
              value.all.should.eql({
                description,
                beforeEach,
                afterEach,
              });
            });
          });

          describe('with a beforeEach and afterEach', () => {
            it('should correctly assign the object', () => {
              value.beforeAfter.should.eql({
                description: descriptionFromFuncStr(beforeEach.toString()),
                beforeEach,
                afterEach,
              });
            });
          });

          describe('with a beforeEach', () => {
            it('should correctly assign the object', () => {
              value.before.should.eql({
                description: descriptionFromFuncStr(beforeEach.toString()),
                beforeEach,
              });
            });
          });

          describe('with a description and beforeEach', () => {
            it('should correctly assign the object', () => {
              value.descriptionBefore.should.eql({
                description,
                beforeEach,
              });
            });
          });

          describe('with a description', () => {
            it('should correctly assign the object', () => {
              value.description.should.eql({
                description,
              });
            });
          });

          describe('with none', () => {
            it('should throw an error', () => {
              expect(value.none).to.throw(
                'neither description or beforeEach specified'
              );
            });
          });
        });
      });
    });

    describe('resolveTestParams', () => {
      _.forEach({
        'with an object for the first argument': {
          all: resolveTestParams({description, test}),
          test: resolveTestParams({test}),
          description: () => resolveTestParams({description}),
          none: () => resolveTestParams({}),
        },
        'with individual arguments': {
          all: resolveTestParams(description, test),
          test: resolveTestParams(test),
          description: () => resolveTestParams(description),
          none: () => resolveTestParams(),
        },
      }, (value, key) => {
        describe(key, () => {
          describe('with a description and test', () => {
            it('should correctly assign the object', () => {
              value.all.should.eql({
                description,
                test,
              });
            });
          });

          describe('with a test', () => {
            it('should correctly assign the object', () => {
              value.test.should.eql({
                description: descriptionFromFuncStr(test.toString()),
                test,
              });
            });
          });

          describe('with a description', () => {
            it('should throw an error', () => {
              expect(value.description).to.throw('test not specified');
            });
          });

          describe('with none', () => {
            it('should throw an error', () => {
              expect(value.none).to.throw('test not specified');
            });
          });
        });
      });
    });
  });
});
