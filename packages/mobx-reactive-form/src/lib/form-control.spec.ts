import { FormControl } from './form-control';
import { autorun } from 'mobx';
import { beforeEach, describe, Mock } from 'vitest';

describe('FormControl', () => {
  describe('ctor', () => {
    let ctrl: FormControl<number>;
    beforeEach(() => {
      ctrl = new FormControl(1);
    });
    test('should create instance of FormControl', () => {
      expect(ctrl).toBeInstanceOf(FormControl);
    });
    test('should set value', () => {
      expect(ctrl.value).toBe(1);
    });
    test('default value is the initial value', () => {
      expect(ctrl.defaultValue).toBe(1);
    });
  });
  describe('ctor with option', () => {
    let ctrl: FormControl<number>;
    test('disabled', () => {
      ctrl = new FormControl<number>({ value: 1, disabled: true });
      expect(ctrl.disabled).toBe(true);
    });
    test('default value option', () => {
      ctrl = new FormControl(1, { defaultValue: 42 });
      expect(ctrl.value).toBe(1);
      expect(ctrl.defaultValue).toBe(42);
    });
  });
  describe('setValue', () => {
    let ctrl: FormControl<number>;
    beforeEach(() => {
      ctrl = new FormControl(1);
    });
    test('should set value', () => {
      ctrl.setValue(2);
      expect(ctrl.value).toBe(2);
    });
    test('value is observable', () => {
      const onChange = vi.fn();
      autorun(() => onChange(ctrl.value));
      ctrl.setValue(2);
      expect(onChange).toBeCalledWith(2);
    });
  });
  describe('validation', () => {
    test('validator is null', () => {
      const ctrl = new FormControl(1);
      expect(ctrl.validator).toBeNull();
    });
    describe('addValidators', () => {
      let ctrl: FormControl<number>;
      beforeEach(() => {
        ctrl = new FormControl(1);
      });
      describe('add one', () => {
        test('validator not empty', () => {
          const v1 = vi.fn();
          ctrl.addValidators(v1);
          expect(ctrl.validator).not.toBeNull();
          ctrl.validator?.(ctrl);
          expect(v1).toBeCalledWith(ctrl);
        });
      });
      describe('add multiple', () => {
        test('validator not empty', () => {
          const v1 = vi.fn();
          const v2 = vi.fn();
          ctrl.addValidators([v1, v2]);
          expect(ctrl.validator).not.toBeNull();
          ctrl.validator?.(ctrl);
          expect(v1).toBeCalledWith(ctrl);
          expect(v2).toBeCalledWith(ctrl);
        });
      });
      describe('invoke add multiple times', () => {
        test('all can be invoked', () => {
          const v1 = vi.fn();
          const v2 = vi.fn();
          ctrl.addValidators(v1);
          ctrl.addValidators(v2);
          expect(ctrl.validator).not.toBeNull();
          ctrl.validator?.(ctrl);
          expect(v1).toBeCalledWith(ctrl);
          expect(v2).toBeCalledWith(ctrl);
        });
      });
    });
    describe('clearValidators', () => {
      let ctrl: FormControl<number>;
      beforeEach(() => {
        ctrl = new FormControl(1);
        ctrl.addValidators(vi.fn());
      });
      test('validator is null', () => {
        ctrl.clearValidators();
        expect(ctrl.validator).toBeNull();
      });
    });
    describe('hasValidator', () => {
      let ctrl: FormControl<number>;
      beforeEach(() => {
        ctrl = new FormControl(1);
      });
      test('has validator', () => {
        const v1 = vi.fn();
        ctrl.addValidators(v1);
        expect(ctrl.hasValidator(v1)).toBe(true);
      });
    });
    describe('setValidators', () => {
      let ctrl: FormControl<number>;
      let v1: Mock;
      let v2: Mock;
      beforeEach(() => {
        ctrl = new FormControl(1);
        v1 = vi.fn();
        v2 = vi.fn();
        ctrl.addValidators([v1, v2]);
        ctrl.setValidators(v2);
      });
      test('check has validator', () => {
        expect(ctrl.hasValidator(v1)).toBe(false);
        expect(ctrl.hasValidator(v2)).toBe(true);
      });
      test('invoke validator', () => {
        ctrl.validator?.(ctrl);
        expect(v1).not.toBeCalled();
        expect(v2).toBeCalledWith(ctrl);
      });
    });
    describe('remove validator', () => {
      let ctrl: FormControl<number>;
      let v1: Mock;
      let v2: Mock;
      let v3: Mock;
      beforeEach(() => {
        ctrl = new FormControl(1);
        v1 = vi.fn();
        v2 = vi.fn();
        v3 = vi.fn();
        ctrl.addValidators([v1, v2, v3]);
      });
      describe('remove one', () => {
        test('check has validator', () => {
          ctrl.removeValidators(v2);
          expect(ctrl.hasValidator(v1)).toBe(true);
          expect(ctrl.hasValidator(v2)).toBe(false);
          expect(ctrl.hasValidator(v3)).toBe(true);
        });
        test('invoke validator', () => {
          ctrl.removeValidators(v2);
          ctrl.validator?.(ctrl);
          expect(v1).toBeCalledWith(ctrl);
          expect(v2).not.toBeCalled();
          expect(v3).toBeCalledWith(ctrl);
        });
      });
      describe('remove all', () => {
        test('validator is null', () => {
          ctrl.removeValidators([v1, v2, v3]);
          expect(ctrl.validator).toBeNull();
        });
      });
    });
    test.todo('errors');
  });
  describe.todo('reset');
});
