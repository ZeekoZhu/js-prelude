import { IKeyValueMap, makeAutoObservable, observable } from 'mobx';
import { FormField } from './form-field';
import { AbstractFormField, IValidatable } from './types';

export type FieldGroupOf<TValue> = {
  [TK in keyof TValue]-?: AbstractFormField<TValue[TK]>;
};

export class FieldGroup<
  TInferredValue extends TStructure extends FieldGroupOf<infer U> ? U : never,
  // todo: remove this type parameter once
  //  constructor parameter type argument inference is supported
  TStructure extends FieldGroupOf<TInferredValue> = FieldGroupOf<TInferredValue>,
> implements AbstractFormField<TInferredValue>, IValidatable
{
  private _isValid = true;
  private _errors: ReadonlyArray<string> = [];
  private _isValidating = false;
  get isValidating() {
    if (this._isValidating) {
      return true;
    }
    const validatingField = this.findField((field) => field.isValidating);
    return !!validatingField;
  }

  set isValidating(val: boolean) {
    this._isValidating = val;
  }

  get errors() {
    return this._errors;
  }

  get isDirty() {
    const dirtyField = this.findField((field) => field.isDirty);
    return !!dirtyField;
  }

  get isTouched() {
    const touchedField = this.findField((field) => field.isTouched);
    return !!touchedField;
  }

  get isValid() {
    if (!this._isValid) {
      return false;
    }
    const invalidField = this.findField((field) => !field.isValid);
    return invalidField === undefined;
  }

  private _fields = observable.map<string, AbstractFormField<unknown>>(
    {},
    { deep: false },
  );

  get value() {
    const result: Record<string, unknown> = {};
    this.forEachField((field, key) => {
      result[key] = field.value;
    });
    return result as TInferredValue;
  }

  get fields(): ReadonlyMap<string, AbstractFormField<unknown>> {
    return this._fields;
  }

  field<TK extends keyof TStructure>(key: TK): TStructure[TK] {
    return this._fields.get(key as string) as TStructure[TK];
  }

  constructor(fields: TStructure) {
    this._fields.replace(fields as IKeyValueMap<AbstractFormField<unknown>>);
    makeAutoObservable(this, {}, { deep: false, autoBind: true });
  }

  setValue(val: TInferredValue): void {
    const value = val as Record<string, unknown>;
    this.forEachField((field, key) => field.setValue(value[key]));
  }

  reset(val?: Partial<TInferredValue>): void {
    const value = val as Record<string, unknown>;
    this.forEachField((field, key) => field.reset(value?.[key]));
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

  addField(name: string, field: FormField<unknown>) {
    this._fields.set(name, field);
  }

  removeField(name: string) {
    this._fields.delete(name);
  }

  containsField(name: string) {
    return this._fields.has(name);
  }

  setField(name: string, field: AbstractFormField<unknown>) {
    this._fields.set(name, field);
  }

  setFields(fields: {
    [key in keyof TInferredValue]: AbstractFormField<TInferredValue[key]>;
  }) {
    this._fields.replace(fields);
  }

  private forEachField(
    fn: (field: AbstractFormField<unknown>, key: string) => void,
  ) {
    for (const [k, f] of this._fields) {
      fn(f, k);
    }
  }

  private findField(
    fn: (field: AbstractFormField<unknown>, key: string) => boolean,
  ) {
    for (const [k, f] of this._fields) {
      if (fn(f, k)) {
        return f;
      }
    }
    return undefined;
  }
}
