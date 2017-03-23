'use strict';

function greet(greeting, person) {
  return `${greeting} ${person}`;
}
let greeting;
let person;

describe('greet', () => {
  given(() => greeting = 'hello')
  .and(() => person = 'fred')
  .fork((chain) => {
    chain
    .or.with(() => greeting = 'auf wiedersehen')
    .and(() => person = 'pete')
    .then(() => greet(greeting, person).should.eql('auf wiedersehen pete'));

    chain
    .or.with(() => greeting = 'bonjour')
    .and(() => person = 'james')
    .then(() => greet(greeting, person).should.eql('bonjour james'));
  })
  .then(() => greet(greeting, person).should.eql('hello fred'))
  .end();

  const chain = given(() => greeting = 'hello')
  .and(() => person = 'fred');

  chain
  .then(() => greet(greeting, person).should.eql('hello fred'));

  chain
  .or.with(() => greeting = 'auf wiedersehen')
  .and(() => person = 'pete')
  .then(() => greet(greeting, person).should.eql('auf wiedersehen pete'));

  chain
  .or.with(() => greeting = 'bonjour')
  .and(() => person = 'james')
  .then(() => greet(greeting, person).should.eql('bonjour james'));

  chain.end();

  chain.end();
});
