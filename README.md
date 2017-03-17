# Forgiven

[![Build Status](https://travis-ci.org/pghalliday/forgiven.svg?branch=master)](https://travis-ci.org/pghalliday/forgiven)
[![Build status](https://ci.appveyor.com/api/projects/status/g7uqlq09d9fwv0wy/branch/master?svg=true)](https://ci.appveyor.com/project/pghalliday/forgiven/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/pghalliday/forgiven/badge.svg?branch=master)](https://coveralls.io/github/pghalliday/forgiven?branch=master)

Extensible given/when/then and more for test frameworks.

## Usage

install `forgiven` and a UI factory (`forgiven-mocha` in this case) as a development dependency.

```shell
npm install --save-dev forgiven forgiven-mocha
```

Then initialize a new `given` function, with the UI factory

```javascript
import {
  create,
} from 'forgiven';
import {
  mocha,
} from 'forgiven-mocha';

global.given = create(mocha);
```

The `given` function can then be used to create concise test chains in place of the verbose `describe/beforeEach/it/afterEach` format.

```javascript
import {
  greet,
} from '../src/greet';

let greeting;
let person;

describe('greet', () => {
  given(() => greeting = 'hello')
  .and(() => person = 'fred')
  .then(() => greet(greeting, person).should.eql('hello fred'))
  .end();
});
```

Note that the chain can consist of multiple setup steps followed by multiple test steps. Test steps start after the first `then` after which only test steps are allowed.

The chain must be ended with a call to `end` which will actually render the chain so far (as an aside, multiple calls to `end` will render the tests multiple times... don't bother doing that).

Chains can also be reused to keep your tests DRY, but rememeber to only `end` them once after completely defining them.

```javascript
const chain = given(() => greeting = 'hello')
.and(() => person = 'fred');

chain
.then(() => greet(greeting, person).should.eql('hello fred'));

chain
.or.with(() => greeting = 'bonjour')
.then(() => greet(greeting, person).should.eql('bonjour fred'));

chain
.or.with(() => greeting = 'ola')
.then(() => greet(greeting, person).should.eql('ola fred'));

chain.end();
```

You may prefer to use the `fork` method for reusing chains in order to layout your shared chains more clearly.

```javascript
given(() => greeting = 'hello')
.and(() => person = 'fred')
.fork((chain) => {
  chain
  .then(() => greet(greeting, person).should.eql('hello fred'));

  chain
  .or.with(() => greeting = 'bonjour')
  .then(() => greet(greeting, person).should.eql('bonjour fred'));

  chain
  .or.with(() => greeting = 'ola')
  .then(() => greet(greeting, person).should.eql('ola fred'));
})
.end();
```

Another bonus to using `fork` is that if you attenpt to `end` a chain inside a `fork` then an error will be thrown.

So far shown is the most concise form of setup and test definition, however the full function signatures for setup steps are

```javascript
setup(description, beforeEach, afterEach);
setup(beforeEach, afterEach);
setup(beforeEach);
setup({description, beforeEach, afterEach});
```

When no `description` is given then the body of the `beforeEach` callback will be used as the description.

The full function signatures for test steps are

```javascript
test(description, test);
test(test);
test({description, test});
```

When no `description` is given then the body of the `test` callback will be used as the description.

You will have noticed that various grammatical constructions can be made. There are in fact a fixed list of words that can be used for setup steps and another list for test steps. The choice of wording only affects the generated test reports as they are appended to the descriptions. The words can also be chained indefinitely (even if it doesn't make sense) and they will all be prefixed to test and setup descriptions. The only limitation is that the setup chain must begin with `given` and the test phase must begin with `then`.

The valid words for setup steps are

```javascript
export const SETUP_CONJUNCTIONS = [
  'given',
  'when',
  'where',
  'while',
  'with',
  'and',
  'or',
];
```

The valid words for test steps are

```javascript
export const TEST_CONJUNCTIONS = [
  'then',
  'and',
];
```

### Pending Setups and Tests

Any setup or test step can be marked as pending (skipped) using the following modifiers.

```javascript
export const PENDING_MODIFIERS = [
  'skip',
  'pending',
  'eventually',
];
```

eg.

```
given(() => greeting = 'hello')
.and(() => person = 'fred')
.then.eventually(() => greet(greeting, person).should.eql('hello fred'))
.end();
```

It is then up to the UI factory to handle the `pending` flag if it supports it.

### Exclusive Setups and Tests

Any setup or test step can be marked as exclusive (other tests will be skipped) using the following modifiers.

```javascript
export const ONLY_MODIFIERS = [
  'only',
  'just',
  'exclusive',
];
```

eg.

```
given(() => greeting = 'hello')
.and(() => person = 'fred')
.then.just(() => greet(greeting, person).should.eql('hello fred'))
.end();
```

It is then up to the UI factory to handle the `only` flag if it supports it.

### Plugins

Plugins can be defined and used to extend the setup steps so that complex behaviour can be expressed in a concise and natural manner. They are registered with the `create` method.

```javascript
import {
  create,
} from 'forgiven';
import {
  webcomponents,
} from 'forgiven-webcomponents';
import {
  mocha
} from 'forgiven-mocha';

global.given = create(mocha, {
  fixture: webcomponents,
});
```

The following plugins are currently available

```shell
# extensions for webcomponent test-fixtures
npm install --save-dev forgiven-webcomponents
```

Each plugin is registered with a name that can be used with setup steps using a determiner.

```javascript
export const DETERMINERS = [
  'the',
  'a',
];
```

For example

```javascript
const context = {};

given.a.fixture.as(context, 'element1').with('my test-fixture id')
.and.a.fixture.as(context, 'element2').with('another test-fixture id')
.then(() => context.element1.$.field.should.eql('something')
.and(() => context.element2.$.field.should.eql('something else')
.end();
```

Creating a plugin is easy (well it depends how complicated you want to make it). A plugin is defined as a function that takes a setup step function as its only parameter. The function then returns an object or function to assign to the registered plugin name. It's important that something inside the plugin calls the setup function and eventually returns the return value so that the chain can be continued.

```javascript
function myPlugin(setup) {
  return (params) => {
    return setup({
      description: params.description,
      beforeEach: params.beforeEach,
      afterEach: params.afterEach,
    });
  };
}
```

### UI Factories

UI factories can be created to support various test frameworks depending on their features. Currently the following UI factories exist.

```shell
# mocha support
npm install --save-dev forgiven-mocha

# jasmine support
npm install --save-dev forgiven-jasmine
```

A UI factory is defined as a function that returns a function that calls the initial setup and handles `setup` and `test` callbacks. Any of the above factories provide an example but as a skeleton, the following should provide guidance.

```javascript
// To define...
//
//  doSetupWithModifiers
//  doBeforeEach
//  doAfterEach
//  doTest
//

function setup({
  description,
  beforeEach,
  afterEach,
  pending,
  only,
}, callback) {
  // add the setup phase with modifiers
  // for pending and only if supported
  doSetupWithModifiers(description, pending, only, () => {
    // call the beforeEach/afterEach
    // functions if specified
    doBeforeEach(beforeEach);
    doAfterEach(afterEach);

    // insert child setups and tests
    callback(
      setup,
      test,
    );
  });
}

function test({description, test, pending, only}) {
  // add a test with modifiers if supported
  doTest(test, pending, only);
}

export function uiFactory(params, callback) {
  return () => {
    setup(params, callback);
  };
}
```

## Contributing

Run tests and build before pushing/opening a pull request.

- `npm test` - lint and test
- `npm start` - watch and build, etc with alarmist
- `npm run build` - run tests then build
- `npm run watch` - watch for changes and run build
- `npm run ci` - run build and submit coverage to coveralls
