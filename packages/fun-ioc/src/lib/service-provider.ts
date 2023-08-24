import { FactoryDescriptor, ValueDescriptor } from './descriptors';
import { providerToken } from './service-collection';
import {
  Func,
  IServiceCollection,
  IServiceProvider,
  IServiceToken,
} from './types';

export class ServiceProvider implements IServiceProvider {
  protected serviceCollection: IServiceCollection;

  constructor(serviceCollection: IServiceCollection) {
    this.serviceCollection = serviceCollection;
    this.serviceCollection.replace(new ValueDescriptor(providerToken.id, this));
  }

  protected objectPool: Record<string, unknown> = {};

  getService<T>(token: IServiceToken<T>): T {
    if (this.objectPool[token.id]) {
      return this.objectPool[token.id] as T;
    }
    const serviceDescriptor = this.serviceCollection.services.find(
      (service) => service.token.id === token.id,
    );

    if (!serviceDescriptor) {
      throw new Error(`No service found for the token: ${token.id}`);
    }

    const created = serviceDescriptor.factory(this) as T;
    this.objectPool[token.id] = created;
    return created;
  }

  extends(config: Func<IServiceCollection, IServiceCollection>): this {
    return new ServiceProvider(config(this.serviceCollection)) as this;
  }
}

export function provideFrom<TTokens extends readonly IServiceToken<unknown>[]>(
  sp: IServiceProvider,
  tokens: TTokens,
) {
  return <TC extends IServiceCollection>(collection: TC) => {
    tokens.forEach((token) => {
      collection.add(
        new FactoryDescriptor(token.id, [], () => sp.getService(token)),
      );
    });
    return collection;
  };
}
