import { makeAutoObservable, observable } from 'mobx';
import { FormField, FormFieldState } from './form-field';
import { IValidatable } from './form-validator';

export class FieldGroup implements FormFieldState, IValidatable {
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
    let result = this._isValid;
    if (!result) {
      return result;
    }
    for (const field of this._fields.values()) {
      result = result && field.isValid;
    }
    return result;
  }

  private _fields = observable.map<string, FormField>({}, { deep: false });

  get value() {
    const result: Record<string, unknown> = {};
    for (const [key, field] of this._fields) {
      result[key] = field.value;
    }
    return result;
  }

  get fields() {
    return this._fields;
  }

  constructor(fields: Record<string, FormField>) {
    this._fields.replace(fields);
    makeAutoObservable(this, {}, { deep: false, autoBind: true });
  }

  setErrors(errors: string[] | undefined): void {
    if (errors == null || errors.length === 0) {
      this._errors = [];
      this._isValid = true;
    } else {
      this._errors = errors;
      this._isValid = errors.length === 0;
    }
  }
}
