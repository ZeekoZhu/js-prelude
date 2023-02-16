import { useCreation } from 'ahooks';
import { runInAction } from 'mobx';
import React, { useCallback } from 'react';
import {
  AbstractFormField,
  FormValidator,
  FormValidatorOptions,
} from '../core';

export interface IValidationTrigger {
  validate(): Promise<void>;

  addValidator(validator: FormValidator<unknown>): void;
}

export class ValidationTrigger implements IValidationTrigger {
  private validators: FormValidator<unknown>[] = [];

  validate = async (): Promise<void> => {
    await Promise.allSettled(
      this.validators.map((validator) => validator.validate()),
    );
  };

  addValidator = (validator: FormValidator<unknown>): void => {
    this.validators.push(validator);
  };
}

export function useValidationTrigger(): IValidationTrigger {
  return useCreation(() => new ValidationTrigger(), []);
}

export interface UseControlPropsOptions<T, TControlValue = T> {
  rules?: FormValidatorOptions<T>;
  /**
   * @default true
   */
  validateOnChange?: boolean;
  /**
   * @default false
   */
  validateOnBlur?: boolean;
  transformControlValue?: (value: TControlValue) => T;
  validateTrigger?: IValidationTrigger;
}

function identity<T>(value: T): T {
  return value;
}

export function useControlProps<T, TControlValue>(
  field: AbstractFormField<T>,
  options: UseControlPropsOptions<T, TControlValue>,
) {
  const validateOnChange = options.validateOnChange ?? true;
  const maybeValidator = useCreation(() => {
    if (!options.rules) {
      return;
    }
    const validator = new FormValidator(field, options.rules);
    options.validateTrigger?.addValidator(validator as FormValidator<unknown>);
    return validator;
  }, [options.rules, options.validateTrigger, field]);
  const onChange = useCallback(
    (value: TControlValue) => {
      runInAction(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        field.setValue((options.transformControlValue ?? identity)(value));
        if (validateOnChange) {
          maybeValidator?.validate();
        }
      });
    },
    [validateOnChange, maybeValidator, field],
  );
  const onBlur = useCallback(() => {
    if (options.validateOnBlur) {
      maybeValidator?.validate();
    }
  }, [maybeValidator, options.validateOnBlur]);
  return {
    onChange: onChange,
    onBlur: onBlur,
    value: field.value,
  };
}

export interface UseHtmlControlReturn<T> {
  onChange: (value: React.ChangeEvent<{ value: T }>) => void;
  onBlur: () => void;
  value: T;
}

export function useHtmlControlProps<T extends string>(
  field: AbstractFormField<T>,
  options: UseControlPropsOptions<T, React.ChangeEvent<{ value: T }>>,
): UseHtmlControlReturn<T> {
  return useControlProps(field, {
    ...options,
    transformControlValue: (value: React.ChangeEvent<{ value: T }>) =>
      value.currentTarget.value,
  });
}
