import assert from 'assert';
import { Thing } from '../Thing';

describe('ThingJS', () => {

  let jane;
  const THING_NAME = 'Jane';

  beforeEach(() => {
    jane = new Thing(THING_NAME);
  });


  describe('Thing can define boolean methods on an instance', () => {
    it('should return correct value from is_a_* method', () => {
      jane.is_a.man;
      assert.equal(true, jane.is_a_man);

      jane.is_a.worker.is_a.cowboy;
      assert.equal(true, jane.is_a_worker);
      assert.equal(true, jane.is_a_cowboy);
    });

    it('should return correct value from is_not_a_* method', () => {
      jane.is_not_a.man;
      assert.equal(true, jane.is_not_a_man);

      jane.is_not_a.worker.is_not_a.cowboy;
      assert.equal(true, jane.is_not_a_worker);
      assert.equal(true, jane.is_not_a_cowboy);
    });

    it('should generate correct properties by mix of is_a and is_not_a props', () => {
      jane.is_not_a.man.is_a.woman;
      assert.equal(false, jane.is_a_man);
      assert.equal(true, jane.is_not_a_man);
      assert.equal(true, jane.is_a_woman);
      assert.equal(false, jane.is_not_a_woman);
    });
  });


  describe('Thing can define properties on a per instance level', () => {
    it('should define property with correct value by is_the prop', () => {
      jane.is_the.parent_of.joe
      assert.equal('joe', jane.parent_of);
    });

    it('should define property with correct value by chained is_the props', () => {
      jane.is_the.parent_of.joe.is_the.child_of.moe;
      assert.equal('joe', jane.parent_of);
      assert.equal('moe', jane.child_of);
    });
  });


  describe('Thing can define single items', () => {
    it('should define instance of Thing', () => {
      jane.has(1).head;
      assert.equal(true, jane.head instanceof Thing);
    });

    it('should has having method', () => {
      jane.has(1).head;
      assert.equal('function', typeof jane.head.having);
    });

    it('should has having method that define single child thing', () => {
      jane.has(1).head.having(1).nose;
      assert.equal(true, jane.head.nose instanceof Thing);
    });

    it('should has child with heaving method', () => {
      jane.has(1).head.having(1).nose;
      assert.equal('function', typeof jane.head.nose.having);
    });

    it('should not has child properties at the parent level', () => {
      jane.has(1).head.having(1).nose;
      assert.equal('undefined', typeof jane.nose);
    });
  });


  describe('Thing can define number of child things', () => {
    it('should create an array when number of child more than one', () => {
      jane.has(2).legs
      assert.equal(2, jane.legs.length);
    });

    it('should create an array with instances of Thing', () => {
      jane.has(2).legs;
      assert.equal(true, jane.legs[0] instanceof Thing);
    });
  });


  describe('Thing can define number of things in a chainable and natural format', () => {
    it('should define properties by each method', () => {
      jane.has(2).arms.each(arm => having(1).hand.having(5).fingers);
      assert.equal(5, jane.arms[0].hand.fingers.length);
    });

    it('should define properties by each method that are Thing instances', () => {
      jane.has(2).arms.each(arm => having(1).hand.having(5).fingers);
      assert.equal(true, jane.arms[0].hand.fingers[0] instanceof Thing);
    });
  });


  describe('Thing can define properties on nested items', () => {
    it('should provide being_the method', () => {
      jane.has(1).head.having(2).eyes.each(eye => being_the.color.blue);
      assert.equal('blue', jane.head.eyes[0].color);
      assert.equal('undefined', typeof jane.head.color);
    });

    it('should provide being_the method that does not reflect on the parent item', () => {
      jane.has(1).head.having(2).eyes.each(eye => being_the.color.blue);
      assert.equal('undefined', typeof jane.head.color);
    });

    it('should provide and_the method', () => {
      jane.has(2).eyes.each(eye => being_the.color.blue.and_the.shape.round);
      assert.equal('blue', jane.eyes[0].color);
      assert.equal('round', jane.eyes[0].shape);
    });

    it('should provide with() method defines single child of nested item that is instance of Thing', () => {
      jane.has(1).head.having(2).eyes.each(eye => being_the.color.blue.with(1).pupil);
      assert.equal(true, jane.head.eyes[0].pupil instanceof Thing);
    });

    it('should provide with() method defines single child of nested item that has all nested item`s methods', () => {
      jane.has(1).head.having(2).eyes.each(eye => being_the.color.blue.with(1).pupil.being_the.color.red);
      assert.equal('red', jane.head.eyes[0].pupil.color);
    });

    it('should provide with() method defines children of nested item', () => {
      jane.has(1).head.having(2).eyes.each(eye => being_the.color.blue.with(1).pupil);
      assert.equal(true, jane.head.eyes[0].pupil instanceof Thing);
    });
  });


  describe('Thing can define methods', () => {
    it('should define method with callback', () => {
      jane.can.speak('spoke', phrase => `${name} says: ${phrase}`);
      assert.equal(`${THING_NAME} says: hello`, jane.speak('hello'));
    });

    it('should track methods calls', () => {
      jane.can.speak('spoke', phrase => `${name} says: ${phrase}`);
      jane.speak('hello');
      assert.deepEqual([`${THING_NAME} says: hello`], jane.spoke);
    });
  });
});