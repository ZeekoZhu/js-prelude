/* eslint-disable @typescript-eslint/no-explicit-any */
export type FormControlStatus = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';
export type FormHooks = 'change' | 'blur' | 'submit';

export interface AsyncValidatorFn {
  (control: AbstractControl<any, any>): Promise<ValidationErrors | null>;
}

export type ValidationErrors = {
  [key: string]: any;
};

export interface ValidatorFn {
  (control: AbstractControl<any, any>): ValidationErrors | null;
}

export abstract class AbstractControl<
  TValue = any,
  TRawValue extends TValue = TValue,
> {
  constructor(
    public validators: ValidatorFn | ValidatorFn[],
    public asyncValidators: AsyncValidatorFn | AsyncValidatorFn[],
  ) {}

  value!: TValue;
  validator: ValidatorFn | null = null;
  asyncValidator: AsyncValidatorFn | null = null;
  // parent: FormGroup | FormArray | null;
  status: FormControlStatus = 'VALID';
  valid = true;
  invalid = false;
  pending = false;
  disabled = false;
  enabled = true;
  errors: ValidationErrors | null = null;
  pristine = true;
  dirty = false;
  touched = false;
  untouched = true;
  // valueChanges: Observable<TValue>;
  // statusChanges: Observable<FormControlStatus>;
  updateOn: FormHooks = 'change';

  // root: AbstractControl;

  abstract setValidators(validators: ValidatorFn | ValidatorFn[]): void;

  abstract setAsyncValidators(
    validators: AsyncValidatorFn | AsyncValidatorFn[],
  ): void;

  abstract addValidators(validators: ValidatorFn | ValidatorFn[]): void;

  abstract addAsyncValidators(
    validators: AsyncValidatorFn | AsyncValidatorFn[],
  ): void;

  abstract removeValidators(validators: ValidatorFn | ValidatorFn[]): void;

  abstract removeAsyncValidators(
    validators: AsyncValidatorFn | AsyncValidatorFn[],
  ): void;

  abstract hasValidator(validator: ValidatorFn): boolean;

  abstract hasAsyncValidator(validator: AsyncValidatorFn): boolean;

  abstract clearValidators(): void;

  abstract clearAsyncValidators(): void;

  abstract markAsTouched(opts?: ChangeNotificationOptions): void;

  abstract markAllAsTouched(): void;

  abstract markAsUntouched(opts?: ChangeNotificationOptions): void;

  abstract markAsDirty(opts?: ChangeNotificationOptions): void;

  abstract markAsPristine(opts?: ChangeNotificationOptions): void;

  abstract markAsPending(opts?: ChangeEventOptions): void;

  abstract disable(opts?: ChangeEventOptions): void;

  abstract enable(opts?: ChangeEventOptions): void;

  // setParent(parent: FormGroup<any> | FormArray<any>): void;

  abstract setValue(value: TRawValue, options?: Record<string, any>): void;

  abstract patchValue(value: TValue, options?: Record<string, any>): void;

  abstract reset(value?: TValue, options?: Record<string, any>): void;

  abstract getRawValue(): any;

  abstract updateValueAndValidity(opts?: ChangeEventOptions): void;

  abstract setErrors(
    errors: ValidationErrors,
    opts?: Omit<ChangeEventOptions, 'onlySelf'>,
  ): void;

  // get<P extends string | (string | number)[]>(
  //   path: P,
  // ): AbstractControl<ɵGetProperty<TRawValue, P>> | null;

  abstract getError(
    errorCode: string,
    path?: string | (string | number)[],
  ): any;

  abstract hasError(
    errorCode: string,
    path?: string | (string | number)[],
  ): boolean;
}

export interface ChangeNotificationOptions {
  onlySelf?: boolean;
}

export interface ChangeEventOptions extends ChangeNotificationOptions {
  emitEvent?: boolean;
}
