import { beforeEach, describe, expect, test } from 'vitest';
import { Accessor, Matcher } from './power-accessor';

describe('power accessor', () => {
  describe('example', () => {
    let complexObject: { a: { b: { c: string }[] } };
    const accessorC = new Accessor('a', 'b', Matcher.all, 'c');
    beforeEach(() => {
      complexObject = {
        a: {
          b: [
            {
              c: 'd',
            },
            {
              c: 'e',
            },
          ],
        },
      };
    });
    test('get', () => {
      expect(accessorC.get(complexObject)).toEqual(['d', 'e']);
    });
    test('set', () => {
      accessorC.set(complexObject, 'f');
      expect(accessorC.get(complexObject)).toEqual(['f', 'f']);
    });
  });
  describe('match by key', () => {
    let complexObject: { a: { b: { c: string } } };
    const accessor = new Accessor<typeof complexObject, string>('a', 'b', 'c');
    beforeEach(() => {
      complexObject = {
        a: {
          b: {
            c: 'd',
          },
        },
      };
    });
    test('get', () => {
      expect(accessor.get(complexObject)).toEqual(['d']);
    });
    test('set', () => {
      accessor.set(complexObject, 'f');
      expect(accessor.get(complexObject)).toEqual(['f']);
    });
  });
  describe('match by index', () => {
    let complexObject: { a: { b: { c: string }[] } };
    const accessor = new Accessor<typeof complexObject, string>(
      'a',
      'b',
      0,
      'c',
    );
    beforeEach(() => {
      complexObject = {
        a: {
          b: [
            {
              c: 'd',
            },
            {
              c: 'e',
            },
          ],
        },
      };
    });
    test('get', () => {
      expect(accessor.get(complexObject)).toEqual(['d']);
    });
    test('set', () => {
      accessor.set(complexObject, 'f');
      expect(complexObject).toMatchInlineSnapshot(`
        {
          "a": {
            "b": [
              {
                "c": "f",
              },
              {
                "c": "e",
              },
            ],
          },
        }
      `);
    });
  });
  describe('match by key predicate function', () => {
    let complexObject: { a: { [key: string]: { c: string } } };
    const accessor = new Accessor<typeof complexObject, string>(
      'a',
      Matcher.when((key) => (key as string).startsWith('b')),
      'c',
    );
    beforeEach(() => {
      complexObject = {
        a: {
          bob: { c: 'd' },
          alice: { c: 'e' },
          billy: { c: 'f' },
        },
      };
    });
    test('get', () => {
      expect(accessor.get(complexObject)).toEqual(['d', 'f']);
    });
    test('set', () => {
      accessor.set(complexObject, 'g');
      expect(complexObject).toMatchInlineSnapshot(`
        {
          "a": {
            "alice": {
              "c": "e",
            },
            "billy": {
              "c": "g",
            },
            "bob": {
              "c": "g",
            },
          },
        }
      `);
    });
  });
  describe('match by value predicate function', () => {
    let complexObject: { a: { b: { [key: string]: string } } };
    const accessor = new Accessor<typeof complexObject, string>(
      'a',
      'b',
      Matcher.when((__, value: string) => value.startsWith('foo')),
    );
    beforeEach(() => {
      complexObject = {
        a: {
          b: {
            foo: 'foo',
            bar: 'bar',
            fooBar: 'foo-bar',
          },
        },
      };
    });
    test('get', () => {
      expect(accessor.get(complexObject)).toEqual(['foo', 'foo-bar']);
    });
    test('set', () => {
      accessor.set(complexObject, 'g');
      expect(complexObject).toMatchInlineSnapshot(`
        {
          "a": {
            "b": {
              "bar": "bar",
              "foo": "g",
              "fooBar": "g",
            },
          },
        }
      `);
    });
  });
  describe('error handling', () => {
    test('key not matched', () => {
      const obj = {
        a: {
          b: [{ c: 'd' }],
        },
      };
      const accessor = new Accessor<typeof obj, string>('a', 'foo', 'c');
      expect(accessor.get(obj)).toEqual([]);
    });
    test('predicate function throws', () => {
      const obj = {
        a: {
          b: [{ c: 'd' }],
        },
      };
      const accessor = new Accessor<typeof obj, string>(
        'a',
        'b',
        Matcher.when((__, value: string) => {
          throw new Error('foo');
        }),
      );
      expect(() => accessor.get(obj)).toThrowErrorMatchingInlineSnapshot(
        '"Failed to match object with matcher at index 2. Error: Error in predicate function called with key: 0, value: {\\"c\\":\\"d\\"}: Error: foo"',
      );
    });
    test('predicate function not matched', () => {
      const obj = {
        a: {
          b: [{ c: 'd' }],
        },
      };
      const accessor = new Accessor<typeof obj, string>(
        'a',
        'b',
        Matcher.when((__, value: string) => value === 'foo'),
      );
      expect(accessor.get(obj)).toEqual([]);
    });
  });
});
