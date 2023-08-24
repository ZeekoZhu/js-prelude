import { FactoryDescriptor, ValueDescriptor } from './descriptors';
import { providerToken } from './service-collection';
import {
  Func,
  IDisposable,
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
    this.checkDisposed();
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

  private checkDisposed() {
    if (!this.objectPool) {
      throw new Error('The service provider has been disposed.');
    }
  }

  dispose(): void {
    Object.values(this.objectPool).forEach((obj) => {
      const dispose = (obj as IDisposable)?.dispose;
      if (dispose && typeof dispose === 'function') {
        dispose();
      }
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.objectPool = null;
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
