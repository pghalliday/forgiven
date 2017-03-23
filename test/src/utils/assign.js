import {
  assign,
} from '../../../src/utils/assign';

describe('utils', () => {
  describe('assign', () => {
    it('should behave like Object.assign', () => {
      const object = {
        prop1: 'prop1',
        prop2: 'prop2',
        prop3: 'prop3',
      };
      const newObject = assign(object, {
        prop2: 'newProp2',
        prop3: 'newProp3',
      }, {
        prop3: 'newNewProp3',
        prop4: 'newNewProp4',
      }, undefined);
      newObject.should.equal(object);
      object.should.eql({
        prop1: 'prop1',
        prop2: 'newProp2',
        prop3: 'newNewProp3',
        prop4: 'newNewProp4',
      });
    });
  });
});
