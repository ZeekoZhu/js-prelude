import { useCreation } from 'ahooks';
import { useLocalObservable } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect } from 'react';
import {
  AbstractFormField,
  FormValidator,
  FormValidatorOptions,
} from '../core';
import { useObservableRef } from './use-observable-ref';

export interface IValidationTrigger {
  validate(): Promise<void>;

  subscribe(onValidate: () => void): () => void;
}

export class ValidationTrigger implements IValidationTrigger {
  private validators: Set<() => void> = new Set<() => void>();

  validate = async (): Promise<void> => {
    await Promise.allSettled(
      Array.from(this.validators).map((validator) => validator()),
    );
  };

  subscribe(onValidate: () => void): () => void {
    this.validators.add(onValidate);
    return () => {
      this.validators.delete(onValidate);
    };
  }
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
  validationTrigger?: IValidationTrigger;
}

function identity<T>(value: T): T {
  return value;
}

export function useControlProps<T, TControlValue>(
  field: AbstractFormField<T>,
  options?: UseControlPropsOptions<T, TControlValue>,
): UseControlReturn<T, TControlValue> {
  const validateOnChange = useObservableRef(options?.validateOnChange ?? true);
  const validateOnBlur = useObservableRef(options?.validateOnBlur ?? false);
  const transformControlValue = useObservableRef(
    options?.transformControlValue ?? identity,
  );
  const rules = useObservableRef(options?.rules);
  const fieldRef = useObservableRef(field);
  const result = useLocalObservable(() => ({
    get validator() {
      const rulesVal = rules.get();
      if (!rulesVal) {
        return;
      }
      return new FormValidator(fieldRef.get(), rulesVal);
    },
    onChange(value: TControlValue | ChangeEvent) {
      fieldRef
        .get()
        .setValue(
          transformControlValue.get()(value as unknown as TControlValue & T),
        );
      if (validateOnChange.get()) {
        this.validator?.validate();
      }
    },
    onBlur() {
      if (validateOnBlur.get()) {
        this.validator?.validate();
      }
    },
    get value() {
      return fieldRef.get().value;
    },
  }));
  useEffect(() => {
    if (options?.validationTrigger && result.validator) {
      return options.validationTrigger.subscribe(() =>
        result.validator?.validate?.(),
      );
    }
    return;
  }, [options?.validationTrigger, result]);

  return result;
}

export interface UseControlReturn<T, TControlValue = T> {
  readonly validator?: FormValidator<T>;
  onBlur: () => void;
  readonly value: T;

  onChange(value: TControlValue): void;
}

export interface UseHtmlControlReturn<T> {
  readonly validator?: FormValidator<T>;
  onChange: (value: React.ChangeEvent<{ value: T }>) => void;
  onBlur: () => void;
  readonly value: T;
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
