import { describe, expect, vi } from 'vitest';
import { IDisposable } from './types';
import { createServiceToken } from './create-service-token';
import {
  defineServiceFactory,
  provideFactory,
  provideValue,
} from './descriptors';
import { providerToken, ServiceCollection } from './service-collection';
import { provideFrom } from './service-provider';

const fooToken = createServiceToken<{ a: number }>('foo');

const barToken = createServiceToken<{ b: number }>('bar');

describe('ServiceProvider', () => {
  it('should return it self with providerToken', () => {
    const sp = new ServiceCollection().buildServiceProvider();
    expect(sp.getService(providerToken)).toBe(sp);
  });

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
    const barFactory = defineServiceFactory([token1], (foo) => ({ b: foo.a }));

    const sp = services
      .pipe(
        provideValue(token1, { a: 1 }),
        provideFactory(barToken, barFactory),
      )
      .buildServiceProvider();
    const instance = sp.getService(barToken);
    expect(instance).toEqual({ b: 1 });
  });

  it('should throw if no service found', () => {
    const sp = new ServiceCollection().buildServiceProvider();
    expect(() => sp.getService(createServiceToken('foo'))).toThrow();
  });

  // it should only invoke factory once
  it('should only invoke factory once', () => {
    const services = new ServiceCollection();
    const factoryMock = vi.fn();
    factoryMock.mockReturnValue({ a: 1 });
    const fooFactory = defineServiceFactory([], factoryMock);
    const sp = services
      .pipe(provideFactory(fooToken, fooFactory))
      .buildServiceProvider();
    expect(sp.getService(fooToken)).toEqual({ a: 1 });
    expect(sp.getService(fooToken)).toEqual({ a: 1 });
    expect(sp.getService(fooToken)).toEqual({ a: 1 });
    expect(factoryMock).toHaveBeenCalledTimes(1);
  });

  describe('extends', () => {
    // it should get service from parent
    it('can get service from parent', () => {
      const parent = new ServiceCollection()
        .pipe(provideValue(fooToken, { a: 1 }))
        .buildServiceProvider();
      const child = parent.extends((services) =>
        services.pipe(provideValue(barToken, { b: 2 })),
      );
      expect(child.getService(fooToken)).toEqual({ a: 1 });
      expect(child.getService(barToken)).toEqual({ b: 2 });
    });

    // it can provide deps later
    it('can provide deps later', () => {
      const fooFactory = defineServiceFactory([barToken], (bar) => ({
        a: bar.b + 10,
      }));
      const parent = new ServiceCollection()
        .pipe(provideFactory(fooToken, fooFactory))
        .buildServiceProvider();

      const child = parent.extends((services) =>
        services.pipe(provideValue(barToken, { b: 2 })),
      );

      expect(child.getService(fooToken)).toEqual({ a: 12 });
    });

    // child provider should return it self for provider token
    test('child provider should return it self for provider token', () => {
      const parent = new ServiceCollection().buildServiceProvider();
      const child = parent.extends((services) => services);
      expect(child.getService(providerToken)).toBe(child);
      expect(child.getService(providerToken)).not.toBe(parent);
    });
  });

  describe('provideFrom', () => {
    it('should provide services from another provider', () => {
      const sp1 = new ServiceCollection()
        .pipe(provideValue(fooToken, { a: 1 }))
        .buildServiceProvider();
      const sp2 = new ServiceCollection()
        .pipe(provideFrom(sp1, [fooToken]))
        .buildServiceProvider();

      const instance = sp2.getService(fooToken);
      expect(instance).toEqual({ a: 1 });
      expect(instance).toBe(sp1.getService(fooToken));
    });
  });

  describe('dispose', () => {
    it('should throw if disposed', () => {
      const sp = new ServiceCollection().buildServiceProvider();
      sp.dispose();
      expect(() => sp.getService(fooToken)).toThrow();
    });

    it('should dispose all services', () => {
      const disposeMock = vi.fn();
      const testToken = createServiceToken<IDisposable>('test');
      const sp = new ServiceCollection()
        .pipe(provideValue(testToken, { dispose: disposeMock }))
        .buildServiceProvider();

      sp.getService(testToken);
      sp.dispose();

      expect(disposeMock).toHaveBeenCalledTimes(1);
    });
  });
});
