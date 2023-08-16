import { createServiceToken } from './create-service-token';
import {
  IServiceCollection,
  IServiceDescriptor,
  IServiceProvider,
  IServiceToken,
} from './types';

export class ValueDescriptor<T> implements IServiceDescriptor<T> {
  public token: IServiceToken<T>;
  dependencies = [];

  constructor(id: string, public value: T) {
    this.token = createServiceToken<T>(id);
  }

  factory(): T {
    return this.value;
  }
}

export class FactoryDescriptor<T, TDeps extends readonly unknown[]>
  implements IServiceDescriptor<T>
{
  public token: IServiceToken<T>;

  constructor(
    id: string,
    dependencies: { [K in keyof TDeps]: IServiceToken<TDeps[K]> },
    protected createWithDeps: (...deps: TDeps) => T,
  ) {
    this.token = createServiceToken<T>(id);
    this.dependencies = dependencies as IServiceToken<unknown>[];
  }

  factory(provider: IServiceProvider): T {
    const deps = this.dependencies.map((dep) => provider.getService(dep));
    return this.createWithDeps(...(deps as unknown as TDeps));
  }

  dependencies: IServiceToken<unknown>[];
}

export function provideValue<T>(token: IServiceToken<T>, value: T) {
  return <TC extends IServiceCollection>(collection: TC) =>
    collection.add(new ValueDescriptor(token.id, value));
}

export interface IServiceFactory<TDeps extends readonly unknown[], T> {
  factory: (...deps: TDeps) => T;
  dependencies: ReadonlyArray<IServiceToken<unknown>>;
}

export function defineServiceFactory<T, TDeps extends readonly unknown[]>(
  dependencies: { [K in keyof TDeps]: IServiceToken<TDeps[K]> },
  createWithDeps: (...deps: TDeps) => T,
): IServiceFactory<TDeps, T> {
  return { dependencies, factory: createWithDeps };
}

export type DepTokens<TDeps> = { [K in keyof TDeps]: IServiceToken<TDeps[K]> };

export function provideFactory<T, TDeps extends readonly unknown[]>(
  token: IServiceToken<T>,
  { dependencies, factory }: IServiceFactory<TDeps, T>,
) {
  return <TC extends IServiceCollection>(collection: TC) =>
    collection.add(
      new FactoryDescriptor<T, TDeps>(
        token.id,
        dependencies as DepTokens<TDeps>,
        factory,
      ),
    );
}
