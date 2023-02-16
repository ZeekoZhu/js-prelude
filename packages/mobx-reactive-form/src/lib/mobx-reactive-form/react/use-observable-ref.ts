import { useCreation } from 'ahooks';
import { observable } from 'mobx';
import { useEffect } from 'react';

export interface IReadonlyObservableRef<T> {
  get(): T;
}

export function useObservableRef<T>(value: T): IReadonlyObservableRef<T> {
  const ref = useCreation(() => observable.box(value, { deep: false }), []);
  useEffect(() => {
    ref.set(value);
  }, [value]);
  return ref;
}
