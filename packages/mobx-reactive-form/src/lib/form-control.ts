import {
  AbstractControl,
  AsyncValidatorFn,
  ChangeEventOptions,
  ChangeNotificationOptions,
  ValidationErrors,
  ValidatorFn,
} from './abstract-control';
import { action, makeObservable, observable } from 'mobx';
import {
  AsyncValidatorManager,
  SyncValidatorManager,
} from './validator-manager';

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
  protected validatorManager = new SyncValidatorManager();
  protected asyncValidatorManager = new AsyncValidatorManager();

  setValidators(validators: ValidatorFn | ValidatorFn[]): void {
    this.validatorManager.setValidators(validators);
    this.validator = this.validatorManager.buildValidator();
  }

  addValidators(validators: ValidatorFn | ValidatorFn[]): void {
    this.validatorManager.addValidators(validators);
    this.validator = this.validatorManager.buildValidator();
  }

  removeValidators(validators: ValidatorFn | ValidatorFn[]): void {
    this.validatorManager.removeValidators(validators);
    this.validator = this.validatorManager.buildValidator();
  }

  hasValidator(validator: ValidatorFn): boolean {
    return this.validatorManager.hasValidator(validator);
  }

  clearValidators(): void {
    this.validatorManager.clearValidators();
    this.validator = this.validatorManager.buildValidator();
  }

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

  addAsyncValidators(validators: AsyncValidatorFn | AsyncValidatorFn[]): void {
    this.asyncValidatorManager.addValidators(validators);
    this.asyncValidator = this.asyncValidatorManager.buildValidator();
  }

  clearAsyncValidators(): void {
    this.asyncValidatorManager.clearValidators();
    this.asyncValidator = this.asyncValidatorManager.buildValidator();
  }

  disable(opts: ChangeEventOptions | undefined): void {}

  enable(opts: ChangeEventOptions | undefined): void {}

  getError(
    errorCode: string,
    path: string | (string | number)[] | undefined,
  ): any {}

  getRawValue(): any {}

  hasAsyncValidator(validator: AsyncValidatorFn): boolean {
    return this.asyncValidatorManager.hasValidator(validator);
  }

  hasError(
    errorCode: string,
    path: string | (string | number)[] | undefined,
  ): boolean {
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
  ): void {
    this.asyncValidatorManager.removeValidators(validators);
    this.asyncValidator = this.asyncValidatorManager.buildValidator();
  }

  reset(value: TValue | undefined, options?: ChangeEventOptions): void {}

  setAsyncValidators(validators: AsyncValidatorFn | AsyncValidatorFn[]): void {
    this.asyncValidatorManager.setValidators(validators);
    this.asyncValidator = this.asyncValidatorManager.buildValidator();
  }

  setErrors(
    errors: ValidationErrors,
    opts: Omit<ChangeEventOptions, 'onlySelf'> | undefined,
  ): void {}

  setValue(value: TValue, options?: ChangeEventOptions): void {
    this.value = value;
  }

  updateValueAndValidity(opts: ChangeEventOptions | undefined): void {}
}
