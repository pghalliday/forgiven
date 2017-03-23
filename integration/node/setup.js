const create = require('../../lib').create;
const mocha = require('forgiven-mocha').mocha;
const chai = require('chai');
chai.should();
global.given = create(mocha);
