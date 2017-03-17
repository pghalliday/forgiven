'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webcomponents = webcomponents;
var forgiven = require('../');

function webcomponents(setup) {
  return {
    as: function as(context, name) {
      var setupFixture = function setupFixture(conjunction, id, data) {
        return setup({
          description: 'as `' + name + '` ' + conjunction + ' ' + id,
          beforeEach: function beforeEach(done) {
            var element = document.getElementbyId(id).create(data);
            element.record = {
              event: function event(_event) {
                return {
                  as: function as(name) {
                    element.addEventListener(_event, function (event) {
                      context[name] = event;
                    });
                  }
                };
              },
              events: function events(event) {
                return {
                  as: function as(name) {
                    context[name] = [];
                    element.addEventListener(event, function (event) {
                      context[name].push(event);
                    });
                  }
                };
              }
            };
            element.promise = {
              event: function event(_event2) {
                return {
                  as: function as(name) {
                    context[name] = new Promise(function (resolve) {
                      var listener = function listener(evt) {
                        element.removeEventListener(_event2, listener);
                        resolve(evt);
                      };
                      element.addEventListener(_event2, listener);
                    });
                  }
                };
              }
            };
            context[name] = element;
            flush(done);
          },
          afterEach: function afterEach(done) {
            context[name].restore();
            flush(done);
          }
        });
      };
      var chain = {};
      forgiven.SETUP_CONJUNCTIONS.forEach(function (conjunction) {
        chain[conjunction] = setupFixture.bind(null, conjunction);
      });
      return next;
    }
  };
};