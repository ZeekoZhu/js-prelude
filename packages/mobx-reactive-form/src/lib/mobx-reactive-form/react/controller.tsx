import { observer } from 'mobx-react-lite';

import { ChangeEvent } from 'react';
import { AbstractFormField } from '../core/index.js';
import {
  useControlProps,
  UseControlPropsOptions,
  UseControlReturn,
} from './use-control-props.js';

export interface ControllerProps<T, TValue> {
  field: AbstractFormField<T>;
  render: (props: UseControlReturn<T, TValue>) => JSX.Element;
  options?: UseControlPropsOptions<T, TValue>;
}

export const Controller = observer(
  <T, TValue = T>(props: ControllerProps<T, TValue>) => {
    const controlProps = useControlProps<T, TValue>(props.field, props.options);
    return props.render(controlProps);
  },
);

export const As = {
  input: asInput,
  checkbox: asCheckbox,
  select: asSelect,
  radio: asRadio,
  number: asNumber,
};
function asInput(f: UseControlReturn<string, string>) {
  return {
    value: f.value,
    onChange: (e: ChangeEvent<HTMLInputElement>) => f.onChange(e.target.value),
    onBlur: f.onBlur,
  };
}

function asCheckbox(f: UseControlReturn<boolean, boolean>) {
  return {
    checked: f.value,
    onChange: (e: ChangeEvent<HTMLInputElement>) =>
      f.onChange(e.target.checked),
    onBlur: f.onBlur,
  };
}

function asSelect(f: UseControlReturn<string, string>) {
  return {
    value: f.value,
    onChange: (e: ChangeEvent<HTMLSelectElement>) => f.onChange(e.target.value),
    onBlur: f.onBlur,
  };
}

function asRadio(f: UseControlReturn<string, string>, value: string) {
  return {
    value,
    checked: f.value === value,
    onChange: (e: ChangeEvent<HTMLInputElement>) => f.onChange(e.target.value),
    onBlur: f.onBlur,
  };
}

function asNumber(f: UseControlReturn<number, number>) {
  return {
    value: f.value,
    onChange: (e: ChangeEvent<HTMLInputElement>) =>
      f.onChange(parseFloat(e.target.value)),
    onBlur: f.onBlur,
  };
}
