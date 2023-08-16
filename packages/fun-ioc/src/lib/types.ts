// eslint-disable-next-line @typescript-eslint/no-unused-vars

export interface IServiceToken<T> {
  id: string;
}

export interface IServiceProvider {
  getService<T>(token: IServiceToken<T>): T;
}

export interface IServiceDescriptor<T> {
  token: IServiceToken<T>;
  dependencies: IServiceToken<unknown>[];
  factory: (provider: IServiceProvider) => T;
}

export type Func<T, R> = (arg: T) => R;

export interface IServiceCollection {
  add<T>(descriptor: IServiceDescriptor<T>): this;

  pipe(...pipeline: Func<this, this>[]): this;

  get services(): IServiceDescriptor<unknown>[];

  buildServiceProvider(): IServiceProvider;
}
