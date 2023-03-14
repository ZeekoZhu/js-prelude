import { beforeEach, describe, expect } from 'vitest';
import { IObjectPointer, ObjectPointer, toPointers } from './object-pointer';
import { Accessor, Matcher } from './power-accessor';

type TestObj = {
  a: {
    b: {
      c: number;
    };
  };
};
type TestArray = {
  a: {
    b: {
      c: number[];
    }[];
  };
};
describe('ObjectPointer', () => {
  describe('object', () => {
    test('it can get reference holder', () => {
      const obj = { a: { b: { c: 1 } } };
      const pointer = new ObjectPointer<TestObj, number>(
        (root) => root.a.b,
        'c',
      );
      expect(pointer.getReferenceHolder(obj)).toStrictEqual({ c: 1 });
    });
    test('it can get value from object', () => {
      const obj = { a: { b: { c: 1 } } };
      const pointer = new ObjectPointer<TestObj, number>(
        (root) => root.a.b,
        'c',
      );
      expect(pointer.get(obj)).toBe(1);
    });
    test('it can set value to object', () => {
      const obj = { a: { b: { c: 1 } } };
      const pointer = new ObjectPointer<TestObj, number>(
        (root) => root.a.b,
        'c',
      );
      pointer.set(obj, 2);
      expect(pointer.get(obj)).toBe(2);
    });
    test('it can remove value from object', () => {
      const obj = { a: { b: { c: 1 } } };
      const pointer = new ObjectPointer<TestObj, number>(
        (root) => root.a.b,
        'c',
      );
      pointer.remove(obj);
      expect(pointer.get(obj)).toBeUndefined();
    });
  });

  describe('array', () => {
    let obj: TestArray;
    beforeEach(() => {
      obj = { a: { b: [{ c: [1] }, { c: [1, 2, 3] }] } };
    });
    test('it can get reference holder', () => {
      const pointer = new ObjectPointer<TestArray, number>(
        (root) => root.a.b[0].c,
        0,
      );
      expect(pointer.getReferenceHolder(obj)).toStrictEqual([1]);
    });
    test('it can get value from array', () => {
      const pointer = new ObjectPointer<TestArray, number>(
        (root) => root.a.b[0].c,
        0,
      );
      expect(pointer.get(obj)).toBe(1);
    });
    test('it can set value to array', () => {
      const pointer = new ObjectPointer<TestArray, number>(
        (root) => root.a.b[0].c,
        0,
      );
      pointer.set(obj, 2);
      expect(pointer.get(obj)).toBe(2);
    });
    test('it can remove value from array', () => {
      const pointer = new ObjectPointer<TestArray, number>(
        (root) => root.a.b[1].c,
        0,
      );
      pointer.remove(obj);
      expect(pointer.get(obj)).toBe(2);
    });
  });

  describe('toPointers', () => {
    describe('object', () => {
      test('it can convert accessor to pointers', () => {
        const obj = { a: { b: { c: 1 } } };
        const accessor = new Accessor<TestObj, number>('a', 'b', 'c');
        const pointers = toPointers(accessor, obj);
        expect(pointers.length).toBe(1);
        const pointer = pointers[0];
        expect(pointer.get(obj)).toBe(1);
        pointer.set(obj, 2);
        expect(pointer.get(obj)).toBe(2);
        pointer.remove(obj);
        expect(pointer.get(obj)).toBeUndefined();
      });
    });
  });

  describe('array', () => {
    describe('accessor to pointers', () => {
      let obj: TestArray;
      let pointers: IObjectPointer<TestArray, number>[];
      beforeEach(() => {
        obj = { a: { b: [{ c: [1] }, { c: [1, 2, 3] }] } };
        const accessor: Accessor<TestArray, number> = new Accessor<
          TestArray,
          number
        >('a', 'b', Matcher.all, 'c', 0);
        pointers = toPointers(accessor, obj);
      });
      test('pointers length', () => {
        expect(pointers.length).toBe(2);
      });
      test('get value', () => {
        expect(pointers[0].get(obj)).toBe(1);
        expect(pointers[1].get(obj)).toBe(1);
      });
      test('set value', () => {
        pointers[0].set(obj, 2);
        expect(pointers[0].get(obj)).toBe(2);
      });
      test('remove value', () => {
        pointers[1].remove(obj);
        expect(pointers[1].get(obj)).toBe(2);
        expect(pointers[1].getReferenceHolder(obj)).toHaveLength(2);
      });

      test('reference holder', () => {
        expect(pointers[0].getReferenceHolder(obj)).toBe(obj.a.b[0].c);
        expect(pointers[1].getReferenceHolder(obj)).toBe(obj.a.b[1].c);
      });
    });
  });

  describe('bugs', () => {
    test('pointer creates sparse array when last matcher is Matcher.all', () => {
      const obj = { a: [{ b: 1 }, { b: 2 }, { b: 3 }] };
      const accessor = new Accessor<{ a: { b: number }[] }, number>(
        'a',
        Matcher.all,
      );
      const pointers = toPointers(accessor, obj);
      pointers[0].remove(obj);
      expect(obj.a.length).toBe(2);
    });
  });
});
