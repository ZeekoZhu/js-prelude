export interface IValidatable {
  isValidating: boolean;

  setErrors(errors: string[] | undefined): void;

  readonly isValid: boolean;

  readonly value: unknown;
}

export interface AbstractFormField<T> extends IValidatable {
  readonly isDirty: boolean;
  readonly isTouched: boolean;
  readonly errors: ReadonlyArray<string>;

  setValue(val: T): void;

  reset(val?: T): void;

  readonly value: T;
}
