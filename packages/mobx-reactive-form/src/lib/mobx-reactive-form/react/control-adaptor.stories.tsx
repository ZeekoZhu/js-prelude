import { StoryFn } from '@storybook/react';
import { useCreation } from 'ahooks';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { FormField } from '../core/index.js';
import {
  UseControlPropsOptions,
  useHtmlControlProps,
  useValidationTrigger,
} from './use-control-props.js';

type StoryParams = Pick<
  UseControlPropsOptions<string>,
  'validateOnChange' | 'validateOnBlur'
> & {
  initValue?: string;
};
const Demo = observer((props: StoryParams) => {
  const field = useCreation(() => new FormField(props.initValue), []);
  const rules = {
    validator: (value: string) => {
      if (value.length >= 5 && value.length < 15) {
        return [];
      }
      return ['Length must be between 5 and 10'];
    },
  };
  const validateTrigger = useValidationTrigger();
  const controlAdaptor = useHtmlControlProps(field, {
    rules,
    ...props,
    validationTrigger: validateTrigger,
  });
  const validStyle = 'border-green-500 focus:outline-green-500';
  const invalidStyle = 'border-red-500 focus:outline-red-500';
  const buttonNormal = 'bg-blue-500 hover:bg-blue-400 active:bg-blue-600';
  const buttonDisabled = 'bg-gray-500 cursor-not-allowed';

  async function handleSubmit() {
    await validateTrigger.validate();
  }

  return (
    <div className="flex flex-col w-72 gap-y-4">
      <span>
        <input
          aria-label="input"
          className={clsx(
            'border px-2 py-1 outline-none' + ' rounded',
            field.isValid ? validStyle : invalidStyle,
          )}
          value={controlAdaptor.value}
          onChange={controlAdaptor.onChange}
          onBlur={controlAdaptor.onBlur}
        />
        <span className="text-sm text-red-500">{field.errors.join(', ')}</span>
      </span>
      <span aria-label="input result">You typed: {field.value} </span>
      <div className="flex justify-between">
        <button
          aria-label="reset"
          onClick={() => field.reset()}
          disabled={!field.isDirty}
          className={clsx(
            'rounded-full py-1 text-blue-500 px-4 border border-blue-500',
          )}
        >
          Reset
        </button>
        <button
          aria-label="submit"
          disabled={!field.isValid}
          className={clsx(
            `rounded-full px-4 py-1 text-white`,
            field.isValid ? buttonNormal : buttonDisabled,
          )}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
});

export const Default: StoryFn = (args: StoryParams) => {
  return <Demo {...args} />;
};
Default.args = {
  validateOnBlur: false,
  validateOnChange: true,
  initValue: 'hello world',
};

export default {
  title: 'api/hooks/ControlAdaptor',
  component: Demo,
};
