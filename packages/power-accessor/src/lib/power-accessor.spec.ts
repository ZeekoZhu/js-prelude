import { beforeEach, describe, expect, test } from 'vitest';
import { Accessor, Matcher } from './power-accessor';

describe('power accessor', () => {
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
  describe.todo('match by key');
  describe.todo('match by index');
  describe.todo('match by value predicate function');
});
