import { vi } from 'vitest';
import { createServiceToken } from './create-service-token';
import {
  defineServiceFactory,
  provideFactory,
  provideValue,
} from './descriptors';
import { ServiceCollection } from './service-collection';

describe('ServiceProvider', () => {
  it('should return the same instance for the same token', () => {
    const services = new ServiceCollection();
    services.pipe(
      provideValue(createServiceToken<{ a: number }>('foo'), { a: 1 }),
    );
    const sp = services.buildServiceProvider();
    const instance1 = sp.getService(createServiceToken('foo'));
    const instance2 = sp.getService(createServiceToken('foo'));
    expect(instance1).toBe(instance2);
  });

  it('should invoke factory with dependencies', () => {
    const services = new ServiceCollection();
    const token1 = createServiceToken<{ a: number }>('foo');
    const token2 = createServiceToken<{ b: number }>('bar');
    const barFactory = defineServiceFactory([token1], (foo) => ({ b: foo.a }));

    const sp = services
      .pipe(provideValue(token1, { a: 1 }), provideFactory(token2, barFactory))
      .buildServiceProvider();
    const instance = sp.getService(token2);
    expect(instance).toEqual({ b: 1 });
  });

  it('should throw if no service found', () => {
    const sp = new ServiceCollection().buildServiceProvider();
    expect(() => sp.getService(createServiceToken('foo'))).toThrow();
  });

  // it should only invoke factory once
  it('should only invoke factory once', () => {
    const services = new ServiceCollection();
    const token1 = createServiceToken<{ a: number }>('foo');
    const factoryMock = vi.fn();
    factoryMock.mockReturnValue({ a: 1 });
    const fooFactory = defineServiceFactory([], factoryMock);
    const sp = services
      .pipe(provideFactory(token1, fooFactory))
      .buildServiceProvider();
    expect(sp.getService(token1)).toEqual({ a: 1 });
    expect(sp.getService(token1)).toEqual({ a: 1 });
    expect(sp.getService(token1)).toEqual({ a: 1 });
    expect(factoryMock).toHaveBeenCalledTimes(1);
  });
});
