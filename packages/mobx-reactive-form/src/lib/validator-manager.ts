import {
  AbstractControl,
  AsyncValidatorFn,
  ValidatorFn,
} from './abstract-control';
import { merge } from 'lodash-es';

abstract class AbstractValidatorManager<T = ValidatorFn | AsyncValidatorFn> {
  protected _validators = new Set<T>();

  abstract buildValidator(): T | null;

  addValidators(validators: T | T[]): void {
    if (Array.isArray(validators)) {
      validators.forEach((validator) => this._validators.add(validator));
    } else {
      this._validators.add(validators);
    }
  }

  clearValidators(): void {
    this._validators.clear();
  }

  hasValidator(validator: T): boolean {
    return this._validators.has(validator);
  }

  removeValidators(validators: T | T[]): void {
    if (Array.isArray(validators)) {
      validators.forEach((validator) => this._validators.delete(validator));
    } else {
      this._validators.delete(validators);
    }
  }

  setValidators(validators: T | T[]): void {
    this.clearValidators();
    this.addValidators(validators);
  }
}

export class SyncValidatorManager extends AbstractValidatorManager<ValidatorFn> {
  buildValidator(): ValidatorFn | null {
    if (this._validators.size === 0) {
      return null;
    }

    const validatorArray = Array.from(this._validators);
    return (control: AbstractControl<any, any>) => {
      const errors = validatorArray
        .map((validator) => validator(control))
        .filter((error) => error != null);
      return errors.length > 0 ? merge({}, ...errors) : null;
    };
  }
}

export class AsyncValidatorManager extends AbstractValidatorManager<AsyncValidatorFn> {
  buildValidator(): AsyncValidatorFn | null {
    if (this._validators.size === 0) {
      return null;
    }

    const validatorArray = Array.from(this._validators);
    return (control: AbstractControl<any, any>) => {
      return Promise.all(
        validatorArray.map((validator) => validator(control)),
      ).then((errors) => {
        return errors.length > 0 ? merge({}, ...errors) : null;
      });
    };
  }
}
