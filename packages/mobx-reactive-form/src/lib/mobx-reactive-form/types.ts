import { IValidatable } from './form-validator';

export interface AbstractFormField extends IValidatable {
  readonly isDirty: boolean;
  readonly isTouched: boolean;
  readonly errors: ReadonlyArray<string>;

  setValue(val: unknown): void;

  reset(val: unknown): void;

}
