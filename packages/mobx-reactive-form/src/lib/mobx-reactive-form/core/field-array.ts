import { makeAutoObservable, observable } from 'mobx';
import { FormField } from './form-field';
import { AbstractFormField } from './types';

interface FormFieldWithKey<T> extends FormField<T> {
  readonly key: string;
}

function makeFieldWithKey<T>(
  formField: FormField<T>,
  index: number,
): FormFieldWithKey<T> {
  return Object.assign(formField, {
    key: index.toString(),
  }) as FormFieldWithKey<T>;
}

export class FieldArray<T> implements AbstractFormField<T[]> {
  constructor(items: FormField<T>[]) {
    this._value.replace(
      items.map((item) => makeFieldWithKey(item, this.nextKey())),
    );
    makeAutoObservable(this, {}, { autoBind: true, deep: false });
  }

  private _fieldCounter = 0;
  private _value = observable.array<FormFieldWithKey<T>>([], { deep: false });
  private _isValid = true;
  private _errors: ReadonlyArray<string> = [];
  private _isValidating = false;

  get fields(): ReadonlyArray<FormFieldWithKey<T>> {
    return this._value;
  }

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
    for (const it of this._value) {
      if (it.isDirty) {
        return true;
      }
    }
    return false;
  }

  get isTouched() {
    for (const it of this._value) {
      if (it.isTouched) {
        return true;
      }
    }
    return false;
  }

  get value(): T[] {
    return this._value.map((field) => field.value);
  }

  get isValid(): boolean {
    let result = this._isValid;
    if (!result) {
      return result;
    }
    for (const it of this._value) {
      result = result && it.isValid;
    }
    return result;
  }

  reset(val?: T[]): void {
    this.forEachField((field, index) => {
      if (val == null || index >= val.length) {
        field.reset();
      } else {
        field.reset(val[index]);
      }
    });
    this.setErrors();
  }

  setErrors(errors?: string[]): void {
    if (errors == null || errors.length === 0) {
      this._errors = [];
      this._isValid = true;
    } else {
      this._errors = errors;
      this._isValid = errors.length === 0;
    }
  }

  setValue(val: T[]): void {
    this.forEachField((field, index) => {
      if (index < val.length) {
        field.setValue(val[index]);
      }
    });
  }

  private forEachField(
    callback: (field: FormFieldWithKey<T>, index: number) => void,
  ): void {
    this._value.forEach(callback);
  }

  field(index: number): FormFieldWithKey<T> {
    this.ensureInRange(index);
    return this._value[index];
  }

  insert(number: number, formField: FormField<T>) {
    this.ensureInRange(number);
    this._value.splice(number, 0, makeFieldWithKey(formField, this.nextKey()));
  }

  remove(number: number) {
    this.ensureInRange(number);
    this._value.splice(number, 1);
  }

  move(from: number, to: number) {
    this.ensureInRange(from);
    this.ensureInRange(to);
    this._value.splice(to, 0, this._value.splice(from, 1)[0]);
  }

  swap(a: number, b: number) {
    this.ensureInRange(a);
    this.ensureInRange(b);
    const temp = this._value[a];
    this._value[a] = this._value[b];
    this._value[b] = temp;
  }

  private ensureInRange(a: number) {
    if (a < 0 || a >= this._value.length) {
      throw new Error('Index out of range');
    }
  }

  setField(index: number, formField: FormField<T>) {
    this.ensureInRange(index);
    this._value[index] = makeFieldWithKey(formField, this.nextKey());
  }

  clear() {
    this._value.clear();
  }

  push(...fields: FormField<T>[]) {
    this._value.push(
      ...fields.map((field) => makeFieldWithKey(field, this.nextKey())),
    );
  }

  private nextKey() {
    return this._fieldCounter++;
  }
}
