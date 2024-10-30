import type { IComputedValue } from 'mobx';
import { action, computed, isComputed, makeAutoObservable } from 'mobx';

export interface IReadonlyReactiveValue<T> {
  get(): T;
}

export interface IReactiveValue<T> extends IReadonlyReactiveValue<T> {
  set(value: T): void;
}

export interface ISignal<T> extends IReactiveValue<T>, IReadonlySignal<T> {}

export interface IReadonlySignal<T> extends IReadonlyReactiveValue<T> {
  (): T;
}

export class ReactiveValue<T> implements IReactiveValue<T> {
  constructor(private value: T) {
    makeAutoObservable<ReactiveValue<T>, 'value'>(
      this,
      {
        value: true,
        set: action,
      },
      {
        deep: false,
        autoBind: true,
      },
    );
  }

  get(): T {
    return this.value;
  }

  set = (value: T): void => {
    this.value = value;
  };
}

export function reactiveValue<T>(value: T): IReactiveValue<T> {
  return new ReactiveValue(value);
}

export function mapReactiveValue<T, R>(
  reactiveValue: IReactiveValue<T>,
  read: (value: T) => R,
  write: (value: R) => T,
): IReactiveValue<R> {
  return {
    get() {
      return read(reactiveValue.get());
    },
    set(value) {
      reactiveValue.set(write(value));
    },
  };
}

export function signal<T>(value: T) {
  const internalValue = new ReactiveValue(value);
  const result = function () {
    return internalValue.get();
  };
  const getter = () => internalValue.get();
  const setter = (x: T) => internalValue.set(x);
  Object.defineProperty(result, 'set', {
    get: () => setter,
  });
  Object.defineProperty(result, 'get', {
    get: () => getter,
  });
  return result as ISignal<T>;
}

export function readonlySignal<T>(input: IComputedValue<T> | (() => T)) {
  let computedValue = input;
  if (!isComputed(computedValue)) {
    computedValue = computed(input as () => T);
  }
  const getter = computedValue as IComputedValue<T>;
  const result = function () {
    return getter.get();
  };

  Object.defineProperty(result, 'get', {
    get: () => () => getter.get(),
  });
  return result as IReadonlySignal<T>;
}
