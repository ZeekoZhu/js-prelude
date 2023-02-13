import { useCreation } from 'ahooks';
import { runInAction } from 'mobx';
import React, { useCallback } from 'react';
import {
  AbstractFormField,
  FormValidator,
  FormValidatorOptions,
} from '../core';

export interface UseControlProps<T, TControlValue = T> {
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
}

function identity<T>(value: T): T {
  return value;
}

export function useControlProps<T, TControlValue>(
  field: AbstractFormField<T>,
  options: UseControlProps<T, TControlValue>,
) {
  const validateOnChange = options.validateOnChange ?? true;
  const maybeValidator = useCreation(() => {
    if (!options.rules) {
      return;
    }
    return new FormValidator(field, options.rules);
  }, [options.rules, field]);
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

export function useHtmlControlProps<T extends string>(
  field: AbstractFormField<T>,
  options: UseControlProps<T, React.ChangeEvent<{ value: T }>>,
) {
  return useControlProps(field, {
    ...options,
    transformControlValue: (value: React.ChangeEvent<{ value: T }>) =>
      value.currentTarget.value,
  });
}
