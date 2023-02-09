import { isObservableProp } from 'mobx';
import { beforeEach, expect, test } from 'vitest';
import { FieldGroup } from './field-group';
import { FormField } from './form-field';
import { FormValidator } from './form-validator';

interface Person {
  name: string;
  age: number;
}

describe('FieldGroup', () => {
  test('can create instance', () => {
    const fieldGroup = new FieldGroup({
      name: new FormField('alice'),
      age: new FormField(99)
    });
    expect(fieldGroup.value).toEqual({ name: 'alice', age: 99 });
  });
  describe('should be observable', () => {
    test.each([['value'], ['errors'], ['isDirty'], ['isTouched']])('%s should be observable', (prop) => {
      const fieldGroup = new FieldGroup({
        name: new FormField('alice'),
        age: new FormField(99)
      });
      expect(isObservableProp(fieldGroup, prop)).toBe(true);
    });
  });

  it('should be touched when value is changed', () => {
    const group = new FieldGroup({
      name: new FormField('alice'),
      age: new FormField(99)
    });
    const name = group.field('name');
    name?.setValue('bob');
    expect(name?.isTouched).toBe(true);
    expect(group.isTouched).toBe(true);
  });

  it('should be dirty when field is dirty', () => {
    const group = new FieldGroup({
      name: new FormField('alice'),
      age: new FormField(99)
    });
    const name = group.field('name');
    name?.setValue('bob');
    expect(name?.isDirty).toBe(true);
    expect(group.isDirty).toBe(true);
  });

  describe('setValue', () => {
    let group: FieldGroup<Person>;
    beforeEach(() => {
      group = new FieldGroup({
        name: new FormField('alice'),
        age: new FormField(99)
      });
    });
    test('should call setValue of each field', () => {
      group.setValue({ name: 'bob', age: 100 });
      expect(group.value).toEqual({ name: 'bob', age: 100 });
      for (const [, f] of group.fields) {
        expect(f.isTouched).toBe(true);
      }
    });
  });

  describe('reset', () => {
    let group: FieldGroup<Person>;
    beforeEach(() => {
      group = new FieldGroup({
        name: new FormField('alice'),
        age: new FormField(99)
      });
    });
    test('should call reset of each field', () => {
      group.reset({ name: 'bob', age: 100 });
      expect(group.value).toEqual({ name: 'bob', age: 100 });
      for (const [, f] of group.fields) {
        expect(f.isTouched).toBe(false);
      }
    });
  });

  describe('validation', () => {
    let group: FieldGroup<Person>;
    beforeEach(() => {
      group = new FieldGroup({
        name: new FormField('alice'),
        age: new FormField(99)
      });
    });
    test('should be valid when no errors in fields', () => {
      expect(group.isValid).toBe(true);
    });

    test('should be invalid when has errors in fields', () => {
      group.field('age').setErrors(['too old']);
      expect(group.isValid).toBe(false);
    });

    test('should support validator', async () => {
      const validator = new FormValidator<{ name: string, age: number }>(group, {
        validator: (value) => {
          if (value.age > 50) {
            return ['too old'];
          }
          return;
        }
      });
      await validator.validate();
      expect(group.isValid).toBe(false);
    });
  });

  describe('dynamic form', () => {
    let group: FieldGroup<Person>;
    beforeEach(() => {
      group = new FieldGroup({
        name: new FormField('alice'),
        age: new FormField(99)
      });
    });
    test('add field', () => {
      group.addField('address', new FormField('beijing'));
      expect(group.value).toEqual({
        name: 'alice',
        age: 99,
        address: 'beijing'
      });
    });
  });
});
