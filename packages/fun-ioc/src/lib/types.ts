// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IServiceToken<T> {
  id: string;
}

export interface IServiceProvider {
  getService<T>(token: IServiceToken<T>): T;

  /**
   * Create a new service provider that extends the current one.
   * @param config
   */
  extends(config: Func<IServiceCollection, IServiceCollection>): this;
}

export interface IServiceDescriptor<T> {
  token: IServiceToken<T>;
  dependencies: IServiceToken<unknown>[];
  factory: (provider: IServiceProvider) => T;
}

export type Func<T, R> = (arg: T) => R;

export interface IServiceCollection {
  /**
   * Add a service descriptor.
   * @param descriptor
   */
  add<T>(descriptor: IServiceDescriptor<T>): this;

  /**
   * Add or replace a service descriptor.
   * @param descriptor
   */
  replace<T>(descriptor: IServiceDescriptor<T>): this;

  pipe(...pipeline: Func<this, this>[]): this;

  get services(): IServiceDescriptor<unknown>[];

  buildServiceProvider(): IServiceProvider;
}
