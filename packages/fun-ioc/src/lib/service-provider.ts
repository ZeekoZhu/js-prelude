import { IServiceCollection, IServiceProvider, IServiceToken } from './types';

export class ServiceProvider implements IServiceProvider {
  private serviceCollection: IServiceCollection;

  constructor(serviceCollection: IServiceCollection) {
    this.serviceCollection = serviceCollection;
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
}
