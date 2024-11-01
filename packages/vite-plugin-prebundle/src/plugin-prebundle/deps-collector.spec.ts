import { describe, test } from 'vitest';
import { addTransitiveMergeRules } from './deps-collector';
import { Lookup } from './lookup';
import { ModuleMergeRules } from './module-merge-rules';

describe('createTransitiveMergeRules', () => {
  test('direct dep can be merged as transitive dep', () => {
    const moduleMergeRules = new ModuleMergeRules({});
    addTransitiveMergeRules(
      moduleMergeRules,
      Lookup.fromRecord({
        a: ['b', 'c'],
      }),
    );

    expect(moduleMergeRules.getMatchingRule('a')).toBeUndefined();
    expect(moduleMergeRules.getMatchingRule('b')).toBe('transitive_a');
    expect(moduleMergeRules.getMatchingRule('c')).toBe('transitive_a');
  });

  test('transitive dep should follow the rule of direct dep', () => {
    const mergeRules = new ModuleMergeRules({
      merge_a: ['a'],
    });
    addTransitiveMergeRules(mergeRules, Lookup.fromRecord({ a: ['b', 'c'] }));

    expect(mergeRules.getMatchingRule('a')).toBe('merge_a');
    expect(mergeRules.getMatchingRule('b')).toBe('merge_a');
  });

  test('deep nested transitive dep should follow the rule of direct dep', () => {
    const mergeRules = new ModuleMergeRules({
      merge_a: ['a'],
    });
    addTransitiveMergeRules(
      mergeRules,
      Lookup.fromRecord({
        a: ['b'],
        b: ['c'],
        c: ['d'],
      }),
    );

    expect(mergeRules.getMatchingRule('a')).toBe('merge_a');
    expect(mergeRules.getMatchingRule('b')).toBe('merge_a');
    expect(mergeRules.getMatchingRule('c')).toBe('merge_a');
    expect(mergeRules.getMatchingRule('d')).toBe('merge_a');
  });
});
