import { useCreation, useUnmount } from 'ahooks';
import { get, noop } from 'lodash-es';
import { observable, runInAction } from 'mobx';
import { MutableRefObject, useEffect, useRef } from 'react';

import { IReadonlyReactiveValue, ReactiveValue } from './reactive-value';

function createObservableRef<T>(valueToRefElement: T) {
  return new ReactiveValue(valueToRefElement);
}

type MapObservableRefType<TValues extends readonly unknown[]> = {
  [K in keyof TValues]: IReadonlyReactiveValue<TValues[K]>;
};

/**
 * This hook is used to set up mobx reactive state in a function component.
 * It is similar to vue's setup function, but the reactivity is provided by
 * mobx.
 * @param valueToRef the values that need to be converted to observable ref,
 * e.g. props, values returned by other hooks.
 * This is useful when you want to use a value that will be changed in the
 * future.
 * If you want to use a value that will not be changed after first render,
 * capture it in the setup function closure.
 * @param setupFn the setup function, it will be called on the first render.
 * The value returned by this function will be returned by this hook.
 * If you want to do cleanup when the component is unmounted,
 * you can call `teardown` function
 * @returns the return value of the setup function.
 */
export const useSetup = <TValues extends readonly unknown[], TSetupReturn>(
  valueToRef: TValues,
  setupFn: (...refs: MapObservableRefType<TValues>) => TSetupReturn,
) => {
  const refs = useRef<ReactiveValue<unknown>[]>([]);
  for (let i = 0; i < valueToRef.length; i++) {
    if (!refs.current[i]) {
      refs.current[i] = createObservableRef(valueToRef[i]);
    } else {
      if (refs.current[i].get() !== valueToRef[i]) {
        refs.current[i].set(valueToRef[i]);
      }
    }
  }

  // the length of refs.current should always equal to the length of valueToRef
  if (refs.current.length > valueToRef.length) {
    console.warn(
      'please make sure the valueToRef array length is not' +
        ' changed after first render',
      refs.current,
      valueToRef,
    );
  }

  const localTeardownRef = useRef<(() => void)[]>([]);
  useUnmount(() => {
    localTeardownRef.current.forEach((it) => it());
  });
  return useCreation(() => {
    localTeardownRef.current = [];
    teardownRef = localTeardownRef;
    const result = setupFn(...(refs.current as any));
    teardownRef = { current: [] };
    return result;
  }, []);
};

let teardownRef: MutableRefObject<(() => void)[]> = { current: [] };

/**
 * Register a callback to be called when the component is unmounted.
 * This function must be called inside a setup function.
 * @param callbackWhenTeardown
 */
export function teardown(callbackWhenTeardown: () => void) {
  teardownRef.current.push(callbackWhenTeardown);
}

/**
 * Register callbacks to be called when the component is unmounted.
 * This function must be called inside a setup function.
 * @param callbacks
 */
export const effects = (...callbacks: (() => void)[]) => {
  callbacks.forEach(teardown);
};

const makeRefProxy = <T extends object>(values?: T) => {
  const map = observable.map(values, {
    deep: false,
    defaultDecorator: observable.ref,
  });

  const proxyObject: Record<string, unknown> = {};
  if (values) {
    for (const key in values) {
      Object.defineProperty(proxyObject, key, {
        get() {
          return map.get(key);
        },
        enumerable: true,
        configurable: false,
      });
    }
  }

  function updateValues(newValues?: T) {
    if (!newValues) return;
    runInAction(() => {
      for (const key in proxyObject) {
        map.set(key, get(newValues, key));
      }
    });
  }

  return [proxyObject as Readonly<T>, updateValues] as const;
};

export interface ISetupHook {
  <TOutput>(modelCreation: () => TOutput): () => TOutput;

  <TInput, TOutput>(modelCreation: (input: TInput) => TOutput): (
    input: TInput,
  ) => TOutput;
}

/**
 * `useSetup` powered hook that allows you to create a setup hook
 * @param modelCreation
 */
export const createSetup: ISetupHook =
  // eslint-disable-next-line @typescript-eslint/ban-types
  (modelCreation: Function) => (input?: Record<string, unknown>) => {
    const [proxyObject, updateValues] = useCreation(
      () => (input ? makeRefProxy(input) : [undefined, noop]),
      [],
    );
    useEffect(() => {
      updateValues(input);
    }, [input, updateValues]);

    return useSetup([], () => {
      if (proxyObject) {
        return modelCreation(proxyObject);
      }
      return (modelCreation as () => unknown)();
    });
  };
