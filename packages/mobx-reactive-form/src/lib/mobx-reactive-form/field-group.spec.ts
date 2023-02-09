import { isObservableProp } from 'mobx';
import { beforeEach, expect, test } from 'vitest';
import { FieldGroup } from './field-group';
import { FormField } from './form-field';
import { FormValidator } from './form-validator';

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

  describe('validation', () => {
    let group: FieldGroup;
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
      group.fields.get('age')?.setErrors(['too old']);
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
});
