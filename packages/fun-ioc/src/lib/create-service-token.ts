import { Impl, IServiceToken } from './types';

export function createServiceToken<T>(id: string) {
  return { id } as IServiceToken<T>;
}
