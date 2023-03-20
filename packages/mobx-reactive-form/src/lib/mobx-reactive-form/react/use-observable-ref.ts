import { useCreation } from 'ahooks';
import { action, IObservableValue, observable } from 'mobx';
import { useEffect } from 'react';

export interface IReadonlyObservableRef<T> {
  get(): T;
}

const setRef = action(
  'setRef',
  <T>(ref: IObservableValue<T | undefined>, value?: T) => ref.set(value),
);
export function useObservableRef<T>(value: T): IReadonlyObservableRef<T> {
  const ref = useCreation(() => observable.box(value, { deep: false }), []);
  useEffect(() => {
    setRef(ref, value);
  }, [value]);
  return ref;
}
