/* eslint-disable */

var given = forgiven.create(forgiven.ui.mocha);
chai.should();

function greet(greeting, person) {
  return greeting + ' ' + person;
}
var greeting;
var person;

describe('greet', function() {
  given(function() {greeting = 'hello'})
  .and(function() {person = 'fred'})
  .fork(function(chain) {
    chain
    .or.with(function() {greeting = 'auf wiedersehen'})
    .and(function() {person = 'pete'})
    .then(function() {greet(greeting, person).should.eql('auf wiedersehen pete')});

    chain
    .or.with(function() {greeting = 'bonjour'})
    .and(function() {person = 'james'})
    .then(function() {greet(greeting, person).should.eql('bonjour james')});
  })
  .then(function() {greet(greeting, person).should.eql('hello fred')})
  .end();

  const chain = given(function() {greeting = 'hello'})
  .and(function() {person = 'fred'});

  chain
  .then(function() {greet(greeting, person).should.eql('hello fred')});

  chain
  .or.with(function() {greeting = 'auf wiedersehen'})
  .and(function() {person = 'pete'})
  .then(function() {greet(greeting, person).should.eql('auf wiedersehen pete')});

  chain
  .or.with(function() {greeting = 'bonjour'})
  .and(function() {person = 'james'})
  .then(function() {greet(greeting, person).should.eql('bonjour james')});

  chain.end();

  chain.end();
});
