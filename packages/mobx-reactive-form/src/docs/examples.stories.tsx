import { useCreation } from 'ahooks';
import { clsx } from 'clsx';

import { Observer } from 'mobx-react-lite';
import {
  AbstractFormField,
  FieldGroup,
  FormField,
} from '../lib/mobx-reactive-form/core';
import { As, Controller } from '../lib/mobx-reactive-form/react/controller';

export default {
  title: 'Docs/Examples',
};

function inputClass(field: AbstractFormField<unknown>) {
  return {
    'input-error': !field.isValid,
  };
}

export const FormGroup = () => {
  const formGroup = useCreation(
    () =>
      new FieldGroup({
        name: new FormField(''),
        age: new FormField(0),
        email: new FormField(''),
        password: new FormField(''),
        select: new FormField('apple'),
        checkbox: new FormField(false),
        radio: new FormField(''),
      }),
    [],
  );
  return (
    <div className="w-[300px]">
      <div className="mockup-code">
        <pre>
          <Observer>
            {() => <code>{JSON.stringify(formGroup.value, null, 2)}</code>}
          </Observer>
        </pre>
      </div>
      <Observer>
        {() => (
          <div className="form-control">
            <label className="label">
              <span className="label-text">name</span>
            </label>
            <Controller
              field={formGroup.field('name')}
              options={{
                rules: {
                  validator: (val) => (val.length > 5 ? ['too long'] : []),
                },
              }}
              render={(f) => (
                <>
                  <input
                    className={clsx(
                      'input input-bordered input-sm',
                      inputClass(formGroup.field('name')),
                    )}
                    name="name"
                    {...As.input(f)}
                  />
                </>
              )}
            />
            <label className="label">
              <span className="label-text-alt">
                {formGroup.field('name').errors?.[0]}
              </span>
            </label>
          </div>
        )}
      </Observer>
      <Observer>
        {() => (
          <div className="form-control">
            <label className="label">
              <span className="label-text">age</span>
            </label>
            <Controller
              field={formGroup.field('age')}
              render={(f) => (
                <input
                  type="number"
                  className="input input-bordered input-sm"
                  name="age"
                  {...As.number(f)}
                />
              )}
            />
          </div>
        )}
      </Observer>
      <Observer>
        {() => (
          <div className="form-control">
            <label className="label">
              <span className="label-text">email</span>
            </label>
            <Controller
              field={formGroup.field('email')}
              render={(f) => (
                <input
                  type="email"
                  className="input input-bordered input-sm"
                  name="email"
                  {...As.input(f)}
                />
              )}
            />
          </div>
        )}
      </Observer>
      <Observer>
        {() => (
          <div className="form-control">
            <label className="label">
              <span className="label-text">password</span>
            </label>
            <Controller
              field={formGroup.field('password')}
              render={(f) => (
                <input
                  className="input input-bordered input-sm"
                  type="password"
                  name="password"
                  {...As.input(f)}
                />
              )}
            />
          </div>
        )}
      </Observer>
      <Observer>
        {() => (
          <div className="form-control">
            <label className="label">
              <span className="label-text">select</span>
            </label>
            <Controller
              field={formGroup.field('select')}
              render={(f) => (
                <select
                  className="select select-sm"
                  name="select"
                  {...As.select(f)}
                >
                  <option value="apple">Apple</option>
                  <option value="banana">Banana</option>
                  <option value="orange">Orange</option>
                </select>
              )}
            />
          </div>
        )}
      </Observer>
      <Observer>
        {() => (
          <div className="form-control">
            <label className="label">
              <span className="label-text">checkbox</span>
              <Controller
                field={formGroup.field('checkbox')}
                render={(f) => (
                  <input
                    className="checkbox checkbox-sm"
                    name="checkbox"
                    type="checkbox"
                    {...As.checkbox(f)}
                  />
                )}
              />
            </label>
          </div>
        )}
      </Observer>
      <Observer>
        {() => (
          <Controller
            field={formGroup.field('radio')}
            render={(f) => (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">apple</span>
                  <input
                    aria-label="apple"
                    className="radio radio-sm"
                    name="radio-group"
                    type="radio"
                    {...As.radio(f, 'apple')}
                  />
                </label>
                <label className="label">
                  <span className="label-text">banana</span>
                  <input
                    className="radio radio-sm"
                    aria-label="banana"
                    name="radio-group"
                    type="radio"
                    {...As.radio(f, 'banana')}
                  />{' '}
                </label>
                <br />
                <label className="label">
                  <span className="label-text">orange</span>
                  <input
                    aria-label="orange"
                    className="radio radio-sm"
                    name="radio-group"
                    type="radio"
                    {...As.radio(f, 'orange')}
                  />
                </label>
              </div>
            )}
          />
        )}
      </Observer>
    </div>
  );
};

FormGroup.parameters = {
  docs: {
    source: {
      type: 'code',
    },
  },
};
