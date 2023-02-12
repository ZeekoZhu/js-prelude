import { isObservableProp } from 'mobx';
import { beforeEach, describe, expect } from 'vitest';
import { FieldArray } from './field-array';
import { FormField } from './form-field';
import { FormValidator } from './form-validator';


describe('FieldArray', () => {
  test('can create instance', () => {
    const fieldArray = new FieldArray([new FormField(1), new FormField(2), new FormField(3)]);
    expect(fieldArray.value).toEqual([1, 2, 3]);
  });

  describe('field key', () => {
    let array: FieldArray<number>;
    beforeEach(() => {
      array = new FieldArray([new FormField(1), new FormField(2), new FormField(3)]);
    });
    it('should be unique', () => {
      const keys = array.fields.map(f => f.key);
      expect(keys.length).toBe(new Set(keys).size);
    });
    it('should set key to field', () => {
      for (const key of array.fields.map(f => f.key)) {
        expect(key).toBeTruthy();
      }
    });
  });


  describe('should be observable', () => {
    test.each([['value'], ['errors'], ['isDirty'], ['isTouched']])('%s should be observable', (prop) => {
      const fieldArray = new FieldArray([new FormField(1), new FormField(2), new FormField(3)]);
      expect(isObservableProp(fieldArray, prop)).toBe(true);
    });
  });

  it('should be touched when value is changed', () => {
    const array = new FieldArray([new FormField(1), new FormField(2), new FormField(3)]);
    const first = array.field(0);
    first?.setValue(4);
    expect(first?.isTouched).toBe(true);
    expect(array.isTouched).toBe(true);
  });

  it('should be dirty when field is dirty', () => {
    const array = new FieldArray([new FormField(1), new FormField(2), new FormField(3)]);
    const first = array.field(0);
    first?.setValue(4);
    expect(first?.isDirty).toBe(true);
    expect(array.isDirty).toBe(true);
  });

  describe('setValue', () => {
    let array: FieldArray<number>;
    beforeEach(() => {
      array = new FieldArray([new FormField(1), new FormField(2), new FormField(3)]);
      array.setValue([4, 5, 6]);
    });
    it('should update value', () => {
      expect(array.value).toEqual([4, 5, 6]);
    });
    it('should be dirty', () => {
      expect(array.isDirty).toBe(true);
      expect(array.isTouched).toBeTruthy();
    });
  });

  describe('reset', () => {
    let array: FieldArray<number>;
    beforeEach(() => {
      array = new FieldArray([new FormField(1), new FormField(2), new FormField(3)]);
      array.setValue([4, 5, 6]);
    });
    it('should reset value', () => {
      array.reset();
      expect(array.value).toEqual([1, 2, 3]);
    });
    it('should be pristine', () => {
      array.reset();
      expect(array.isDirty).toBe(false);
      expect(array.isTouched).toBeFalsy();
    });
  });

  describe('validation', () => {
    let array: FieldArray<number>;
    beforeEach(() => {
      array = new FieldArray([new FormField(1), new FormField(2), new FormField(3)]);
    });

    it('should be valid when all fields are valid', () => {
      expect(array.isValid).toBe(true);
    });

    it('should be invalid when any field is invalid', () => {
      const first = array.field(0);
      first?.setErrors(['error']);
      expect(array.isValid).toBe(false);
    });

    it('should support validator', async () => {
      const validator = new FormValidator<number[]>(array, {
        validator: (value) => {
          if (value.length < 4) {
            return ['error'];
          }
          return;
        }
      });
      await validator.validate();
      expect(array.isValid).toBe(false);
    });
  });

  describe('dynamic form', () => {
    let array: FieldArray<number>;
    beforeEach(() => {
      array = new FieldArray([new FormField(1), new FormField(2), new FormField(3)]);
    });

    describe('insert', () => {
      beforeEach(() => {
        array.insert(1, new FormField(4));
      });
      it('should add unique key to field', () => {
        const field = array.field(3);
        expect(field?.key).toBeTruthy();
        const keys = array.fields.map(f => f.key);
        expect(keys.length).toBe(new Set(array.fields.map(f => f.key)).size);
      });
      it('should update value', () => {
        expect(array.value).toEqual([1, 4, 2, 3]);
      });

      it('should throw error when index is out of range', () => {
        expect(() => array.insert(10, new FormField(4))).toThrowError();
      });
    });
    describe('remove', () => {
      beforeEach(() => {
        array.remove(1);
      });
      it('should remove field', () => {
        expect(array.fields.length).toBe(2);
      });
      it('should update value', () => {
        expect(array.value).toEqual([1, 3]);
      });
      it('should throw error when index is out of range', () => {
        expect(() => array.remove(10)).toThrowError();
      });
    });
    describe('move', () => {
      beforeEach(() => {
        array.move(1, 0);
      });
      it('should move field', () => {
        expect(array.field(0)?.value).toBe(2);
      });
      it('should update value', () => {
        expect(array.value).toEqual([2, 1, 3]);
      });
      it('should throw error when index is out of range', () => {
        expect(() => array.move(10, 0)).toThrowError();
      });
    });
    describe('swap', () => {
      beforeEach(() => {
        array.swap(1, 2);
      });
      it('should swap field', () => {
        expect(array.field(1).value).toBe(3);
      });
      it('should update value', () => {
        expect(array.value).toEqual([1, 3, 2]);
      });
      it('should throw error when index is out of range', () => {
        expect(() => array.swap(10, 0)).toThrowError();
      });
    });
    describe('setField', () => {
      beforeEach(() => {
        array.setField(1, new FormField(4));
      });
      it('should set field', () => {
        expect(array.field(1)?.value).toBe(4);
      });
      it('should update value', () => {
        expect(array.value).toEqual([1, 4, 3]);
      });
      it('should throw error when index is out of range', () => {
        expect(() => array.setField(10, new FormField(4))).toThrowError();
      });
    });
    describe('clear', () => {
      beforeEach(() => {
        array.clear();
      });
      it('should clear fields', () => {
        expect(array.fields.length).toBe(0);
      });
      it('should update value', () => {
        expect(array.value).toEqual([]);
      });
    });
    describe('push', () => {
      beforeEach(() => {
        array.push(new FormField(4));
      });
      it('should add field', () => {
        expect(array.fields.length).toBe(4);
      });
      it('should update value', () => {
        expect(array.value).toEqual([1, 2, 3, 4]);
      });
      it('can push multiple fields', () => {
        array.push(new FormField(5), new FormField(6));
        expect(array.value).toEqual([1, 2, 3, 4, 5, 6]);
      });
    });
  });
  describe('bugs', () => {
    it('should clear errors when reset', () => {
      const field = new FieldArray([new FormField(1), new FormField(2), new FormField(3)]);
      field.setErrors(['error']);
      field.reset();
      expect(field.errors).toEqual([]);
    });
  });
});
