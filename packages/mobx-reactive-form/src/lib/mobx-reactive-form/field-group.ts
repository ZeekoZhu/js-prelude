import { makeAutoObservable, observable } from 'mobx';
import { FormField } from './form-field';
import { IValidatable } from './form-validator';
import { AbstractFormField } from './types';

export class FieldGroup<T extends object> implements AbstractFormField<T>, IValidatable {
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
    for (const field of this._fields.values()) {
      if (field.isDirty) {
        return true;
      }
    }
    return false;
  }

  get isTouched() {
    for (const field of this._fields.values()) {
      if (field.isTouched) {
        return true;
      }
    }
    return false;
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

  private _fields = observable.map<string, FormField<unknown>>({}, { deep: false });

  get value() {
    const result: Record<string, unknown> = {};
    for (const [key, field] of this._fields) {
      result[key] = field.value;
    }
    return result as T;
  }

  get fields(): ReadonlyMap<string, FormField<unknown>> {
    return this._fields;
  }

  field<TK extends keyof T>(key: TK): FormField<T[TK]> {
    return this._fields.get(key as string) as FormField<T[TK]>;
  }

  constructor(fields: { [key in keyof T]: FormField<T[key]> }) {
    this._fields.replace(fields);
    makeAutoObservable(this, {}, { deep: false, autoBind: true });
  }

  setValue(val: T): void {
    const value = val as Record<string, unknown>;
    for (const [key, field] of this._fields) {
      if (key in value) {
        field.setValue((value)[key]);
      }
    }
  }

  reset(val?: Partial<T>): void {
    const value = val as Record<string, unknown>;
    for (const [key, field] of this._fields) {
      if (value == null) {
        field.reset();
      } else if (key in value) {
        field.reset((value)[key]);
      }
    }
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

  addField(name: string, field: FormField<unknown>) {
    this._fields.set(name, field);
  }
}
