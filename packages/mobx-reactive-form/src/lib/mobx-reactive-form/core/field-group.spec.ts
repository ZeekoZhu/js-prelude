import { isObservableProp, reaction } from 'mobx';
import { beforeEach, describe, expect, test } from 'vitest';
import { FieldGroup } from './field-group';
import { FormField } from './form-field';
import { FormValidator } from './form-validator';

interface Person {
  name: string;
  age: number;
  address?: {
    address1: string;
    address2: string;
  };
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
      expect(group.isDirty).toBe(true);
      expect(group.isTouched).toBe(true);
      for (const [, f] of group.fields) {
        expect(f.isDirty).toBe(true);
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
      expect(group.errors).toEqual([]);
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
    describe('add field', () => {
      test('should update value', () => {
        group.addField('address', new FormField('beijing'));
        expect(group.value).toEqual({
          name: 'alice',
          age: 99,
          address: 'beijing'
        });
      });

      it('should not be dirty', () => {
        group.addField('address', new FormField('beijing'));
        expect(group.isDirty).toBe(false);
        expect(group.isTouched).toBe(false);
      });
      describe('then reset with initial fields', () => {
        beforeEach(() => {
          group.addField('address', new FormField('beijing'));
          group.reset({ name: 'bob', age: 100 });
        });
        test('should remove new field', () => {
          expect(group.value).toEqual({
            name: 'bob',
            age: 100,
            address: 'beijing'
          });
        });
        it('should not be dirty', () => {
          expect(group.isDirty).toBe(false);
        });
      });
      describe('then reset with undefined', () => {
        beforeEach(() => {
          group.addField('address', new FormField('beijing'));
          group.field('name').setValue('bob');
          group.reset();
        });
        test('should keep new field', () => {
          expect(group.value).toEqual({
            name: 'alice',
            age: 99,
            address: 'beijing'
          });
        });
      });

      describe('then reset with partial initial fields', () => {
        beforeEach(() => {
          group.addField('address', new FormField('beijing'));
          group.reset({ name: 'bob' });
        });
        test('should remove fields not in value', () => {
          expect(group.value).toEqual({
            name: 'bob',
            age: 99,
            address: 'beijing'
          });
        });
      });
    });
    describe('remove filed', () => {
      let group: FieldGroup<Person>;
      beforeEach(() => {
        group = new FieldGroup({
          name: new FormField('alice'),
          age: new FormField(99)
        });
        group.removeField('name');
      });

      it('should be dirty', () => {
        expect(group.isDirty).toBe(false);
        expect(group.isTouched).toBe(false);
      });

      it('should update value', () => {
        expect(group.value).toEqual({
          age: 99
        });
      });
    });
  });

  describe('containsField', () => {
    let group: FieldGroup<Person>;
    beforeEach(() => {
      group = new FieldGroup({
        name: new FormField('alice'),
        age: new FormField(99)
      });
    });
    it('should return true when contains field', () => {
      expect(group.containsField('name')).toBe(true);
    });
    it('should return false when not contains field', () => {
      expect(group.containsField('address')).toBe(false);
    });
  });

  describe('setField', () => {
    let group: FieldGroup<Person>;
    beforeEach(() => {
      group = new FieldGroup({
        name: new FormField('alice'),
        age: new FormField(99)
      });
      group.setField('name', new FormField('bob'));
    });

    it('should update value', () => {
      expect(group.value).toEqual({
        name: 'bob',
        age: 99
      });
    });

    it('should not be dirty', () => {
      expect(group.isDirty).toBe(false);
    });
  });

  describe('setFields', () => {
    test('should run reaction only once', () => {
      const group = new FieldGroup({
        name: new FormField('alice'),
        age: new FormField(99)
      });
      const spy = vi.fn();
      const dispose = reaction(() => group.value, spy);
      group.setFields({
        name: new FormField('bob'),
        age: new FormField(100)
      });
      expect(spy).toBeCalledTimes(1);
      dispose();
    });
  });

  describe('complex nested', () => {
    let group: FieldGroup<Record<string, Person>>;
    beforeEach(() => {
      group = new FieldGroup<Record<string, Person>>({
        foo: new FieldGroup<Person>({
          name: new FormField('alice'),
          age: new FormField(99),
          address: new FieldGroup({
            address1: new FormField('beijing'),
            address2: new FormField('chongqing')
          })
        }),
      });
    });

    it('should produce correct value', () => {
      expect(group.value).toEqual({
        foo: {
          name: 'alice',
          age: 99,
          address: {
            address1: 'beijing',
            address2: 'chongqing'
          }
        }
      });
    });
  });

  describe('bugs', ()=>{
    it('should clear errors when reset', ()=>{
      const group = new FieldGroup({
        name: new FormField('alice'),
        age: new FormField(99)
      });
      group.setErrors(['error']);
      group.reset();
      expect(group.errors).toEqual([]);
    });
  })
});
