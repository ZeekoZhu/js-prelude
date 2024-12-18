import { makeAutoObservable, observable } from 'mobx';
import { AbstractFormField } from './types.js';

export class FormField<T> implements AbstractFormField<T> {
  initValue: unknown = undefined;
  private _value: unknown = undefined;
  private _isDirty = false;
  private _isTouched = false;
  private _isValid = true;
  private _errors: ReadonlyArray<string> = [];
  private _isValidating = false;

  get isValidating() {
    return this._isValidating;
  }

  set isValidating(val: boolean) {
    this._isValidating = val;
  }

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
    return this._value as T;
  }

  setValue(val: T) {
    // todo: allow customizing comparer
    if (val !== this.initValue) {
      this._isDirty = true;
    }
    this._isTouched = true;
    this._value = val;
  }

  constructor(initValue: T) {
    makeAutoObservable<FormField<T>, '_errors'>(
      this,
      {
        initValue: false,
        _errors: observable.shallow,
      },
      { autoBind: true, deep: false },
    );
    this.reset(initValue);
  }

  reset(val?: T) {
    if (val !== undefined) {
      this.initValue = val;
    }
    this._value = this.initValue;
    this._isDirty = false;
    this._isTouched = false;
    this.setErrors();
  }

  setErrors(errors?: string[]) {
    if (errors == null || errors.length === 0) {
      this._errors = [];
      this._isValid = true;
    } else {
      this._errors = errors;
      this._isValid = errors.length === 0;
    }
  }
}
