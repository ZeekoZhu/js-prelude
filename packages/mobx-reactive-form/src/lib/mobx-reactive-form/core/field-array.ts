import { makeAutoObservable, observable } from 'mobx';
import { AbstractFormField } from './types';

export type FormFieldWithKey<
  T,
  _TForm extends AbstractFormField<T>,
> = _TForm & {
  readonly key: string;
};

function makeFieldWithKey<T, TForm extends AbstractFormField<T>>(
  formField: TForm,
  index: number,
): FormFieldWithKey<T, TForm> {
  return Object.assign(formField, {
    key: index.toString(),
  }) as FormFieldWithKey<T, TForm>;
}

function isArrayEqual(a: string[], b: string[]) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    const aItem = a[i];
    const bItem = b[i];
    if (aItem !== bItem) {
      return false;
    }
  }
  return true;
}

export type FieldArrayOf<TValue> = ReadonlyArray<AbstractFormField<TValue>>;

export interface FieldArrayConstructor {
  new <TValue, TStructure extends FieldArrayOf<TValue> = FieldArrayOf<TValue>>(
    values: TStructure,
  ): FieldArray<TStructure[number]['value'], TStructure>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly prototype: FieldArray<any>;
}

export interface FieldArray<
  TInferredValue,
  TStructure extends FieldArrayOf<TInferredValue> = FieldArrayOf<TInferredValue>,
> extends AbstractFormField<TInferredValue[]> {
  readonly fields: ReadonlyArray<
    FormFieldWithKey<TInferredValue, TStructure[number]>
  >;
  isValidating: boolean;
  readonly errors: ReadonlyArray<string>;
  readonly isDirty: boolean;
  readonly isTouched: boolean;
  readonly value: TInferredValue[];
  readonly isValid: boolean;

  reset(val?: TInferredValue[]): void;

  setErrors(errors?: string[]): void;

  setValue(val: TInferredValue[]): void;

  forEachField(
    callback: (
      field: FormFieldWithKey<TInferredValue, TStructure[number]>,
      index: number,
    ) => void,
  ): void;

  field(index: number): FormFieldWithKey<TInferredValue, TStructure[number]>;

  insert(number: number, formField: TStructure[number]): void;

  remove(number: number): void;

  move(from: number, to: number): void;

  swap(a: number, b: number): void;

  ensureInRange(a: number): void;

  setField(index: number, formField: TStructure[number]): void;

  clear(): void;

  push(...fields: TStructure): void;

  nextKey(): number;
}

class FieldArrayImpl<
  TInferredValue,
  TStructure extends FieldArrayOf<TInferredValue> = FieldArrayOf<TInferredValue>,
> implements FieldArray<TInferredValue, TStructure>
{
  constructor(items: TStructure) {
    this._value.replace(
      items.map((item) => makeFieldWithKey(item, this.nextKey())),
    );
    this.fieldKeys.replace(this.fields.map((it) => it.key));
    makeAutoObservable(this, {}, { autoBind: true, deep: false });
  }

  private fieldKeys = observable.array<string>([], { deep: false });

  private _fieldCounter = 0;
  private _value = observable.array<
    FormFieldWithKey<TInferredValue, TStructure[number]>
  >([], {
    deep: false,
  });
  private _isValid = true;
  private _errors: ReadonlyArray<string> = [];
  private _isValidating = false;

  get fields(): ReadonlyArray<
    FormFieldWithKey<TInferredValue, TStructure[number]>
  > {
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
    return !isArrayEqual(
      this.fieldKeys,
      this.fields.map((it) => it.key),
    );
  }

  get isTouched() {
    for (const it of this._value) {
      if (it.isTouched) {
        return true;
      }
    }
    return !isArrayEqual(
      this.fieldKeys,
      this.fields.map((it) => it.key),
    );
  }

  get value(): TInferredValue[] {
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

  reset(val?: TInferredValue[]): void {
    this.forEachField((field, index) => {
      if (val == null || index >= val.length) {
        field.reset();
      } else {
        field.reset(val[index] as TInferredValue);
      }
    });
    const keys = this.fields.map((it) => it.key);
    this.fieldKeys.replace(keys);
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

  setValue(val: TInferredValue[]): void {
    this.forEachField((field, index) => {
      if (index < val.length) {
        field.setValue(val[index] as TInferredValue);
      }
    });
  }

  forEachField(
    callback: (
      field: FormFieldWithKey<TInferredValue, TStructure[number]>,
      index: number,
    ) => void,
  ): void {
    this._value.forEach(callback);
  }

  field(index: number): FormFieldWithKey<TInferredValue, TStructure[number]> {
    this.ensureInRange(index);
    return this._value[index];
  }

  insert(number: number, formField: TStructure[number]) {
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

  ensureInRange(a: number) {
    if (a < 0 || a >= this._value.length) {
      throw new Error('Index out of range');
    }
  }

  setField(index: number, formField: TStructure[number]) {
    this.ensureInRange(index);
    this._value[index] = makeFieldWithKey(formField, this.nextKey());
  }

  clear() {
    this._value.clear();
  }

  push(...fields: TStructure) {
    this._value.push(
      ...fields.map((field) =>
        makeFieldWithKey<TInferredValue, TStructure[number]>(
          field,
          this.nextKey(),
        ),
      ),
    );
  }

  nextKey() {
    return this._fieldCounter++;
  }
}

export const FieldArray = FieldArrayImpl as FieldArrayConstructor;
