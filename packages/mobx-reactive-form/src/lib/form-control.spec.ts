import { FormControl } from './form-control';
import { autorun } from 'mobx';

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
    beforeEach(() => {
      ctrl = new FormControl(1, { defaultValue: 42 });
    });
    test('default value option', () => {
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
});
