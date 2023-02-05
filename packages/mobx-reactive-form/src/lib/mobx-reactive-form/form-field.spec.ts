import { isObservableProp } from 'mobx';
import { beforeEach, expect } from 'vitest';
import { FormField } from './form-field';

describe('FormField', () => {
  test('should be created with initial value', () => {
    const formField = new FormField('initial value');
    expect(formField.initValue).toBe('initial value');
    expect(formField.value).toBe('initial value');
  });
  describe('it should be observable', () => {
    let formField: FormField;
    beforeEach(() => {
      formField = new FormField('initial value');
    });

    test.each([['value'], ['errors'], ['isDirty'], ['isTouched']])('%s should be observable', (prop) => {
      expect(isObservableProp(formField, prop)).toBe(true);
    });

    test('initValue should not be observable', () => {
      expect(isObservableProp(formField, 'initValue')).toBe(false);
    });
  });

  test('should be touched when value is changed', () => {
    const formField = new FormField('initial value');
    formField.setValue('new value');
    expect(formField.isTouched).toBe(true);
  });
  test('should be touched when value is changed to the same value', () => {
    const formField = new FormField('initial value');
    formField.setValue('initial value');
    expect(formField.isTouched).toBe(true);
  });
  test('should be dirty when value is changed', () => {
    const formField = new FormField('initial value');
    formField.setValue('new value');
    expect(formField.isDirty).toBe(true);
  });
  test('should not be dirty when value is changed to the same value', () => {
    const formField = new FormField(12);
    formField.setValue(12);
    expect(formField.isDirty).toBe(false);
  });
  test('reset should reset value and state', () => {
    const formField = new FormField('initial value');
    formField.setValue('new value');
    formField.reset('init 2');
    expect(formField.value).toBe('init 2');
    expect(formField.isDirty).toBe(false);
    expect(formField.isTouched).toBe(false);
  });

  test('should be valid when no errors', () => {
    const formField = new FormField('initial value');
    expect(formField.isValid).toBe(true);
  });

  test('should be invalid when has errors', () => {
    const formField = new FormField('initial value');
    formField.setErrors(['error 1', 'error 2']);
    expect(formField.isValid).toBe(false);
  });
});
