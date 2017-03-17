import {
  create,
  SETUP_CONJUNCTIONS,
  TEST_CONJUNCTIONS,
  DETERMINERS,
  ONLY_MODIFIERS,
  PENDING_MODIFIERS,
} from '../../src';
import {
  uiFactory,
  createSetup,
  createTest,
} from '../helpers/ui-factory';
import {
  plugin,
} from '../helpers/plugin';
import {
  cloneDeep,
} from 'lodash';

let chain;

const initialSetup = {
  description: 'given setup 1',
  beforeEach: 'beforeEach: setup 1',
  afterEach: 'afterEach: setup 1',
  only: false,
  pending: false,
  setup: [],
  test: [],
};

const withTests = (tests) => {
  const setup = cloneDeep(initialSetup);
  tests.forEach((test) => {
    const modifier = test.modifier ? `${test.modifier} ` : '';
    setup.test.push({
      description: `${test.conjunction} ${modifier}${test.description}`,
      test: `test: ${test.description}`,
      only: test.only || false,
      pending: test.pending || false,
    });
  });
  return setup;
};

const subSetup = (conjunction, params = {}) => {
  const setup = cloneDeep(initialSetup);
  const modifier = params.modifier ? `${params.modifier} ` : '';
  setup.setup.push({
    description: `${conjunction} ${modifier}setup 1/1`,
    beforeEach: 'beforeEach: setup 1/1',
    afterEach: 'afterEach: setup 1/1',
    only: params.only || false,
    pending: params.pending || false,
    setup: [],
    test: [],
  });
  return setup;
};

const parallelSetups = (descriptions) => {
  const setup = cloneDeep(initialSetup);
  descriptions.forEach((description) => {
    setup.setup.push({
      description: `and ${description}`,
      beforeEach: `beforeEach: ${description}`,
      afterEach: `afterEach: ${description}`,
      only: false,
      pending: false,
      setup: [],
      test: [],
    });
  });
  return setup;
};

describe('given', () => {
  beforeEach(() => {
    const given = create(uiFactory);
    chain = given(createSetup('setup 1'));
  });

  it('should add initial setup', () => {
    chain.end().should.eql(initialSetup);
  });

  SETUP_CONJUNCTIONS.forEach((conjunction) => {
    describe(conjunction, () => {
      beforeEach(() => {
        chain = chain[conjunction](createSetup('setup 1/1'));
      });

      it('should add a sub setup step', () => {
        chain.end().should.eql(subSetup(conjunction));
      });
    });

    PENDING_MODIFIERS.forEach((modifier) => {
      describe(`with modifier '${modifier}'`, () => {
        beforeEach(() => {
          chain = chain[conjunction][modifier](createSetup('setup 1/1'));
        });

        it('should add a setup marked as pending', () => {
          chain.end().should.eql(subSetup(conjunction, {
            modifier,
            pending: true,
          }));
        });
      });
    });

    ONLY_MODIFIERS.forEach((modifier) => {
      describe(`with modifier '${modifier}'`, () => {
        beforeEach(() => {
          chain = chain[conjunction][modifier](createSetup('setup 1/1'));
        });

        it('should add a setup marked as only', () => {
          chain.end().should.eql(subSetup(conjunction, {
            modifier,
            only: true,
          }));
        });
      });
    });

    SETUP_CONJUNCTIONS.forEach((chainedConjunction) => {
      describe(`${conjunction}.${chainedConjunction}`, () => {
        beforeEach(() => {
          chain = chain[conjunction][chainedConjunction](
            createSetup('setup 1/1')
          );
        });

        it('should add a sub setup step', () => {
          chain.end().should.eql(
            subSetup(`${conjunction} ${chainedConjunction}`)
          );
        });
      });
    });
  });

  describe('fork', () => {
    const descriptions = [
      'setup 1/1',
      'setup 1/2',
      'setup 1/3',
    ];

    beforeEach(() => {
      chain = chain.fork((chain) => {
        descriptions.forEach((description) => {
          chain.and(createSetup(description));
        });
      });
    });

    it('should add parallel setup steps', () => {
      chain.end().should.eql(parallelSetups(descriptions));
    });

    describe('when ending inside a fork', () => {
      it('should throw an error', () => {
        expect(() => {
          chain.fork((chain) => {
            chain.fork((chain) => {
              chain.end();
            });
          });
        }).to.throw('end cannot be called inside fork');
      });
    });
  });

  describe('then', () => {
    beforeEach(() => {
      chain = chain.then(createTest('test 1/1'));
    });

    it('should add a test', () => {
      chain.end().should.eql(withTests([{
        description: 'test 1/1',
        conjunction: 'then',
      }]));
    });

    PENDING_MODIFIERS.forEach((modifier) => {
      describe(`with modifier '${modifier}'`, () => {
        beforeEach(() => {
          chain = chain.then[modifier](createTest('test 1/2'));
        });

        it('should add a test marked as pending', () => {
          chain.end().should.eql(withTests([{
            description: 'test 1/1',
            conjunction: 'then',
          }, {
            description: 'test 1/2',
            conjunction: 'then',
            pending: true,
            modifier: modifier,
          }]));
        });
      });
    });

    ONLY_MODIFIERS.forEach((modifier) => {
      describe(`with modifier '${modifier}'`, () => {
        beforeEach(() => {
          chain = chain.then[modifier](createTest('test 1/2'));
        });

        it('should add a test marked as only', () => {
          chain.end().should.eql(withTests([{
            description: 'test 1/1',
            conjunction: 'then',
          }, {
            description: 'test 1/2',
            conjunction: 'then',
            only: true,
            modifier: modifier,
          }]));
        });
      });
    });

    TEST_CONJUNCTIONS.forEach((conjunction) => {
      describe(conjunction, () => {
        beforeEach(() => {
          chain = chain[conjunction](createTest('test 1/2'));
        });

        it('should add another test', () => {
          chain.end().should.eql(withTests([{
            description: 'test 1/1',
            conjunction: 'then',
          }, {
            description: 'test 1/2',
            conjunction: conjunction,
          }]));
        });
      });

      TEST_CONJUNCTIONS.forEach((chainedConjunction) => {
        describe(`${conjunction}.${chainedConjunction}`, () => {
          beforeEach(() => {
            chain = chain[conjunction][chainedConjunction](
              createTest('test 1/2')
            );
          });

          it('should add another test', () => {
            chain.end().should.eql(withTests([{
              description: 'test 1/1',
              conjunction: 'then',
            }, {
              description: 'test 1/2',
              conjunction: `${conjunction} ${chainedConjunction}`,
            }]));
          });
        });
      });
    });
  });
});

describe('plugins', () => {
  DETERMINERS.forEach((determiner) => {
    describe(`with determiner '${determiner}'`, () => {
      beforeEach(() => {
        const given = create(uiFactory, {
          plugin1: plugin,
          plugin2: plugin,
        });
        chain =
        given[determiner].plugin1('setup')
        .and[determiner].plugin2('setup')
        .then(createTest('test'));
      });

      it('should add setups and test', () => {
        chain.end().should.eql({
          description: `given ${determiner} plugin1 setup`,
          beforeEach: 'beforeEach: setup',
          afterEach: 'afterEach: setup',
          only: false,
          pending: false,
          setup: [{
            description: `and ${determiner} plugin2 setup`,
            beforeEach: 'beforeEach: setup',
            afterEach: 'afterEach: setup',
            only: false,
            pending: false,
            setup: [],
            test: [{
              description: 'then test',
              test: 'test: test',
              only: false,
              pending: false,
            }],
          }],
          test: [],
        });
      });
    });
  });
});
