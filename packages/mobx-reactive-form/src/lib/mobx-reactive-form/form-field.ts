import {
  makeAutoObservable,
  observable
} from 'mobx';

export interface FormFieldState {
  readonly isDirty: boolean;
  readonly isTouched: boolean;
  readonly isValid: boolean;
}

export class FormField implements FormFieldState {
  initValue: unknown = undefined;
  private _value: unknown = undefined;
  private _isDirty = false;
  private _isTouched = false;
  private _isValid = true;
  private _errors: ReadonlyArray<string> = [];

  get errors() {
    return this._errors;
  }

  get isDirty() {
    return this._isDirty;
  }

  get isTouched() {
    return this._isTouched;
  }

  get isValid() {
    return this._isValid;
  }


  get value() {
    return this._value;
  }

  setValue(val: unknown) {
    // todo: allow customizing comparer
    if (val !== this.initValue) {
      this._isDirty = true;
    }
    this._isTouched = true;
    this._value = val;
  }

  constructor(initValue: unknown) {
    makeAutoObservable<FormField, '_errors'>(this, {
      initValue: false,
      _errors: observable.shallow,
    }, { autoBind: true, deep: false });
    this.reset(initValue);
  }

  reset(val: unknown) {
    this.initValue = val;
    this._value = val;
    this._isDirty = false;
    this._isTouched = false;
  }

  setErrors(errors: string[]) {
    this._errors = errors;
    this._isValid = errors.length === 0;
  }
}
