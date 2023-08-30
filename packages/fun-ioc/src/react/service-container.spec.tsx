import { render } from '@testing-library/react';
import {
  createServiceToken,
  defineServiceFactory,
  IDisposable,
  provideFactory,
  provideValue,
  ServiceCollection,
} from '../lib';
import { it, describe, expect, vi } from 'vitest';
import { createServiceContainer, useService } from './functions';

const someString = createServiceToken<string>('someString');
const disposable = createServiceToken<IDisposable>('disposable');
const testFactory = createServiceToken<string>('testFactory');

function prepareFixture() {
  const dispose = vi.fn();
  const factoryMock = vi.fn(() => 'testFactory');
  const factory = defineServiceFactory([], factoryMock);
  const services = new ServiceCollection().pipe(
    provideValue(someString, 'someValue'),
    provideValue(disposable, { dispose }),
    provideFactory(testFactory, factory),
  );

  const ServiceContainer = createServiceContainer(services);
  return { dispose, ServiceContainer, factoryMock };
}

const TestComponent = () => {
  const value = useService(someString);
  useService(disposable);
  useService(testFactory);
  return <div>{value}</div>;
};
describe('ServiceContainer', () => {
  it('create service container', () => {
    const { dispose, ServiceContainer } = prepareFixture();
    const screen = render(
      <ServiceContainer>
        <TestComponent />
      </ServiceContainer>,
    );
    const value = screen.getByText('someValue');
    expect(value).toBeInTheDocument();
  });
  it('should dispose services on unmount', () => {
    const { dispose, ServiceContainer } = prepareFixture();
    const screen = render(
      <ServiceContainer>
        <TestComponent />
      </ServiceContainer>,
    );
    screen.unmount();
    expect(dispose).toHaveBeenCalledOnce();
  });
  it('should not invoke factory when rerender', () => {
    const { ServiceContainer, factoryMock } = prepareFixture();
    const screen = render(
      <ServiceContainer>
        <TestComponent />
      </ServiceContainer>,
    );
    screen.rerender(
      <ServiceContainer>
        <TestComponent />
      </ServiceContainer>,
    );
    screen.rerender(
      <ServiceContainer>
        <TestComponent />
      </ServiceContainer>,
    );
    expect(factoryMock).toHaveBeenCalledOnce();
  });

  it('should not dispose services on rerender', () => {
    const { dispose, ServiceContainer } = prepareFixture();
    const screen = render(
      <ServiceContainer>
        <TestComponent />
      </ServiceContainer>,
    );
    screen.rerender(
      <ServiceContainer>
        <TestComponent />
      </ServiceContainer>,
    );
    expect(dispose).not.toHaveBeenCalled();
  });
});
