import { IValidatable } from './types';

export type ValidatorFn<T> = (value: T) => string[] | undefined;

export type ValidatorFnAsync<T> = (value: T) => Promise<string[] | undefined>;

export interface FormValidatorOptions<T> {
  validator?: ValidatorFn<T>;
  asyncValidator?: ValidatorFnAsync<T>;
}

export class FormValidator<T> {
  constructor(public field: IValidatable, public options: FormValidatorOptions<T>) {
  }

  async validate(): Promise<void> {
    try {
      this.field.isValidating = true;
      const { validator, asyncValidator } = this.options;
      const { value } = this.field;
      const errors = validator?.(value as T);
      this.field.setErrors(errors || undefined);
      if (this.field.isValid && asyncValidator) {
        const asyncErrors = await asyncValidator(value as T);
        this.field.setErrors(asyncErrors || undefined);
      }
    } finally {
      this.field.isValidating = false;
    }
  }
}
