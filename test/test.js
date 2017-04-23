import assert from 'assert';
import { Thing } from '../Thing';

describe('ThingJS', () => {

  let jane;

  beforeEach(() => {
    jane = new Thing('Jane');
  });

  describe('Thing can define boolean methods on an instance', () => {

    it('should return correct value from is_a method', () => {
      jane.is_a.man;
      assert.equal(true, jane.is_a_man);

      jane.is_a.worker.is_a.cowboy;
      assert.equal(true, jane.is_a_worker);
      assert.equal(true, jane.is_a_cowboy);
    });

    it('should return correct value from is_not_a method', () => {
      jane.is_not_a.man;
      assert.equal(true, jane.is_not_a_man);

      jane.is_not_a.worker.is_not_a.cowboy;
      assert.equal(true, jane.is_not_a_worker);
      assert.equal(true, jane.is_not_a_cowboy);
    });

    it('should generate correct properties by mix of is_a and is_not_a methods', () => {
      jane.is_not_a.man.is_a.woman;
      assert.equal(false, jane.is_a_man);
      assert.equal(true, jane.is_not_a_man);
      assert.equal(true, jane.is_a_woman);
      assert.equal(false, jane.is_not_a_woman);
    });
  });

  xdescribe('Thing can define properties on a per instance level', () => {
    it('', () => {

    });
  });

  xdescribe('Thing can define number of child things', () => {
    it('', () => {

    });
  });

  xdescribe('Thing can define single items', () => {
    it('', () => {

    });
  });

  xdescribe('Thing can define number of things in a chainable and natural format', () => {
    it('', () => {

    });
  });

  xdescribe('Thing can define properties on nested items', () => {
    it('', () => {

    });
  });
});