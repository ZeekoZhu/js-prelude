import {
  AbstractControl,
  AsyncValidatorFn,
  ChangeEventOptions,
  ChangeNotificationOptions,
  ValidationErrors,
  ValidatorFn,
} from './abstract-control';
import { action, makeObservable, observable } from 'mobx';
import { merge } from 'lodash-es';

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

function composeValidators(validators: Iterable<ValidatorFn>) {
  const validatorArray = Array.from(validators);
  return (control: AbstractControl<any, any>) => {
    const errors = validatorArray.map((validator) => validator(control));
    return errors.length > 0 ? merge({}, ...errors) : null;
  };
}

export class FormControl<TValue = any> extends AbstractControl<TValue> {
  protected _validators = new Set<ValidatorFn>();

  constructor(
    value: TValue | FormControlState<TValue>,
    options?: { defaultValue: TValue | null },
  ) {
    super([], []);
    makeObservable(
      this,
      {
        value: observable.ref,
        setValue: action.bound,
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

  addValidators(validators: ValidatorFn | ValidatorFn[]): void {
    if (Array.isArray(validators)) {
      validators.forEach((validator) => this._validators.add(validator));
    } else {
      this._validators.add(validators);
    }
    this.validator = composeValidators(this._validators);
  }

  clearAsyncValidators(): void {}

  clearValidators(): void {
    this._validators.clear();
    this.validator = null;
  }

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
    return this._validators.has(validator);
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

  removeValidators(validators: ValidatorFn | ValidatorFn[]): void {
    if (Array.isArray(validators)) {
      validators.forEach((validator) => this._validators.delete(validator));
    } else {
      this._validators.delete(validators);
    }
    if (this._validators.size > 0) {
      this.validator = composeValidators(this._validators);
    } else {
      this.validator = null;
    }
  }

  reset(value: TValue | undefined, options?: ChangeEventOptions): void {}

  setAsyncValidators(validators: AsyncValidatorFn | AsyncValidatorFn[]): void {}

  setErrors(
    errors: ValidationErrors,
    opts: Omit<ChangeEventOptions, 'onlySelf'> | undefined,
  ): void {}

  setValidators(validators: ValidatorFn | ValidatorFn[]): void {
    this.clearValidators();
    this.addValidators(validators);
  }

  setValue(value: TValue, options?: ChangeEventOptions): void {
    this.value = value;
  }

  updateValueAndValidity(opts: ChangeEventOptions | undefined): void {}
}
