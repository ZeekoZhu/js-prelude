import { useCreation } from 'ahooks';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { FormField, FormValidator, FormValidatorOptions } from '../core';

const Demo = observer(() => {
  const field = useCreation(() => new FormField('hello world'), []);
  const rules = {
    validator: (value) => {
      if (value.length >= 5 && value.length < 15) {
        return [];
      }
      return ['Length must be between 5 and 10'];
    },
  };
  const controlAdaptor = useControlAdaptor(field, {
    rules,
    validateOnBlur: true,
    validateOnChange: false,
  });
  const validStyle = 'border-green-500 focus:outline-green-500';
  const invalidStyle = 'border-red-500 focus:outline-red-500';
  const buttonNormal = 'bg-blue-500 hover:bg-blue-400 active:bg-blue-600';
  const buttonDisabled = 'bg-gray-500 cursor-not-allowed';
  return <div className='flex flex-col w-72 gap-y-4'>
    <span>
    <input className={clsx('border px-2 py-1 outline-none rounded', field.isValid ? validStyle : invalidStyle)}
           {...controlAdaptor} />
    <span className='text-sm text-red-500'>{field.errors.join(', ')}</span>
    </span>
    <span>You typed: {field.value} </span>
    <button className={clsx(`rounded-full py-1 text-white`, field.isValid ? buttonNormal : buttonDisabled)}>Submit</button>
    <button onClick={() => field.reset()} className={clsx('rounded-full py-1' +
      ' text-blue-500' +
      ' border border-blue-500')}>Reset
    </button>
  </div>;
});


function useControlAdaptor<T>(field: FormField<T>, options: {
  rules?: FormValidatorOptions<T>,
  /**
   * @default true
   */
  validateOnChange?: boolean,
  /**
   * @default false
   */
  validateOnBlur?: boolean,
}) {
  const validateOnChange = options.validateOnChange ?? true;
  const maybeValidator = useCreation(() => {
    if (!options.rules) {
      return;
    }
    return new FormValidator(field, options.rules);
  }, [options.rules, field]);
  return {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (validateOnChange) {
        maybeValidator?.validate();
      }
      field.setValue(e.target.value as unknown as T);
    },
    onBlur: () => {
      if (options.validateOnBlur) {
        maybeValidator?.validate();
      }
    },
    value: field.value,
  };
}

export const Default = () => {
  return <Demo />;
};

export default {
  title: 'ControlAdaptor',
  component: Demo,
};
