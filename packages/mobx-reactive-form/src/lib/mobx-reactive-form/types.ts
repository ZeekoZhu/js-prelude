import { IValidatable } from './form-validator';

export interface AbstractFormField<T> extends IValidatable {
  readonly isDirty: boolean;
  readonly isTouched: boolean;
  readonly errors: ReadonlyArray<string>;

  setValue(val: T): void;

  reset(val?: T): void;
  readonly value: T;

}
