import { ServiceProvider } from './service-provider';
import {
  Func,
  IServiceCollection,
  IServiceDescriptor,
  IServiceProvider,
} from './types';

export class ServiceCollection implements IServiceCollection {
  private servicesArray: IServiceDescriptor<unknown>[] = [];

  add<T>(descriptor: IServiceDescriptor<T>): this {
    this.servicesArray.push(descriptor);
    return this;
  }

  pipe(...pipeline: Func<this, this>[]): this {
    return pipeline.reduce((acc, fn) => fn(acc), this);
  }

  get services(): IServiceDescriptor<unknown>[] {
    return this.servicesArray;
  }

  buildServiceProvider(): IServiceProvider {
    return new ServiceProvider(this);
  }
}
