import {
  AbstractControl,
  AsyncValidatorFn,
  ChangeEventOptions,
  ChangeNotificationOptions,
  ValidationErrors,
  ValidatorFn,
} from './abstract-control';
import { makeAutoObservable, makeObservable, observable } from 'mobx';

export interface FormControlState<T> {
  value: T;
  disabled: boolean;
}

function isFormControlState<TValue>(
  value: FormControlState<TValue> | TValue,
): value is FormControlState<TValue> {
  return (
    value != null &&
    typeof value === 'object' &&
    'value' in value &&
    'disabled' in value
  );
}

export class FormControl<TValue = any> extends AbstractControl<TValue> {
  constructor(
    value: TValue | FormControlState<TValue>,
    options?: { defaultValue: TValue | null },
  ) {
    super([], []);
    makeObservable(
      this,
      {
        value: observable.ref,
      },
      { autoBind: true, deep: false },
    );
    if (isFormControlState(value)) {
      this.value = value.value;
      this.disabled = value.disabled;
    } else {
      this.value = value;
      this.disabled = false;
    }
    this.defaultValue = options?.defaultValue ?? this.value;
  }

  /**
   * The default value of this FormControl, used whenever the control is reset without an explicit value.
   */
  defaultValue: TValue | null = null;

  addAsyncValidators(validators: AsyncValidatorFn | AsyncValidatorFn[]): void {}

  addValidators(validators: ValidatorFn | ValidatorFn[]): void {}

  clearAsyncValidators(): void {}

  clearValidators(): void {}

  disable(opts: ChangeEventOptions | undefined): void {}

  enable(opts: ChangeEventOptions | undefined): void {}

  getError(
    errorCode: string,
    path: string | (string | number)[] | undefined,
  ): any {}

  getRawValue(): any {}

  hasAsyncValidator(validator: AsyncValidatorFn): boolean {
    return false;
  }

  hasError(
    errorCode: string,
    path: string | (string | number)[] | undefined,
  ): boolean {
    return false;
  }

  hasValidator(validator: ValidatorFn): boolean {
    return false;
  }

  markAllAsTouched(): void {}

  markAsDirty(opts: ChangeNotificationOptions | undefined): void {}

  markAsPending(opts: ChangeEventOptions | undefined): void {}

  markAsPristine(opts: ChangeNotificationOptions | undefined): void {}

  markAsTouched(opts: ChangeNotificationOptions | undefined): void {}

  markAsUntouched(opts: ChangeNotificationOptions | undefined): void {}

  patchValue(value: TValue, options?: ChangeNotificationOptions): void {}

  removeAsyncValidators(
    validators: AsyncValidatorFn | AsyncValidatorFn[],
  ): void {}

  removeValidators(validators: ValidatorFn | ValidatorFn[]): void {}

  reset(value: TValue | undefined, options?: ChangeEventOptions): void {}

  setAsyncValidators(validators: AsyncValidatorFn | AsyncValidatorFn[]): void {}

  setErrors(
    errors: ValidationErrors,
    opts: Omit<ChangeEventOptions, 'onlySelf'> | undefined,
  ): void {}

  setValidators(validators: ValidatorFn | ValidatorFn[]): void {}

  setValue(value: TValue, options?: ChangeEventOptions): void {
    this.value = value;
  }

  updateValueAndValidity(opts: ChangeEventOptions | undefined): void {}
}
