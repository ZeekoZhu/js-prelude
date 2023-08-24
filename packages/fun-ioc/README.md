# fun-ioc

An easy to use IoC container for TypeScript.

- No decorators
- No compiler plugins
- Just plain TypeScript

## Installation

```bash
npm install --save @zeeko/fun-ioc
```

## Usage

### Tutorial

#### 1. Define a service

```ts
import { createServiceToken } from '@zeeko/fun-ioc';

// create an interface for the service
export interface VcsApi {
  getUsername(): string;

  getEmail(): string;

  getRepoUrl(): string;
}

// create a token for the service, since TypeScript interfaces are not available at runtime
export const VcsApi = createServiceToken<VcsApi>('VcsApi');
```

- The `VcsApi` interface is used to define the contract of the service, if you
  want to have a different implementation of the service,
  using a contract interface is better than inheriting from a base class.
- The `createServiceToken` function creates a token for the service, so that we
  can identify it at runtime.

#### 2. Implement the service

```ts
const GitVscApi: VcsApi = {
  getUsername() {
    return 'git-user';
  },
  getEmail() {
    return '';
  },
  getRepoUrl() {
    return '';
  },
};
```

- with TypeScript interface, we can easily create an implementation of the
  service with just plain objects.

#### 3. Register the service in a `ServiceCollection`

```ts
import { ServiceCollection, provideValue } from '@zeeko/fun-ioc';

const services = new ServiceCollection();
services.pipe(provideValue(VcsApi, GitVscApi));
```

- The `ServiceCollection` is a mutable collection of service definitions, you
  usually create a `ServiceCollection` at the bootstrap of your application.

#### 4. Retrieve the service

```ts
// we can now build a service provider from the service collection
const serviceProvider = services.buildServiceProvider();

const vcsApi = serviceProvider.getService(VcsApi);
```

- The `ServiceProvider` is where we retrieve the service from, and it is created
  from a `ServiceCollection`.

### `ServiceCollection` Examples

Let's
see some examples of how to define a service
and register it in a `ServiceCollection`.

#### Provide a value

To provide a constant value, we use the `provideValue` function.

```ts
import {
  ServiceCollection,
  provideValue,
  createServiceToken,
} from '@zeeko/fun-ioc';

const someString = createServiceToken<string>('someString');
const services = new ServiceCollection();
services.pipe(provideValue(someString, 'some value'));
```

#### Provide a factory

To provide a factory, we use the `provideFactory` function,
the `ServiceProvider` will call the factory function to create the service.

The factory function accepts an array of dependencies as the first argument, and
a function that returns the service as the second argument.

```ts
import {
  createServiceToken,
  defineServiceFactory,
  ServiceCollection,
} from '@zeeko/fun-ioc';

const someString = createServiceToken<string>('someString');

const someStringFactory = defineServiceFactory([], () => 'some value');

const services = new ServiceCollection();
services.pipe(provideFactory(someString, someStringFactory));
```

#### Provide a factory with dependencies

If you want to create a service that depends on other services,
just pass the dependencies as the first argument of the factory function,
and the signature of the factory function will
be `(...dependencies) => service`.

```ts
import {
  createServiceToken,
  defineServiceFactory,
  ServiceCollection,
} from '@zeeko/fun-ioc';

const someString = createServiceToken<string>('someString');
const someOtherString = createServiceToken<string>('someOtherString');

const someStringFactory = defineServiceFactory(
  [someOtherString],
  (otherString) => {
    return otherString + 'some value';
  },
);

const services = new ServiceCollection();
services.pipe(provideFactory(someString, someStringFactory));
```

#### Provide services from an existed `ServiceProvider`

Provide services from an existed `ServiceProvider` is useful
when you want
to reuse some services from another `ServiceProvider` to keep it a singleton.

```ts
import { ServiceCollection, provideFrom } from '@zeeko/fun-ioc';

// let's say we have a service provider `rootProvider` that provides a string 'hello'

const serviceProvider = new ServiceCollection()
  .pipe(provideFrom(rootProvider))
  .buildServiceProvider();

const hello = serviceProvider.getService(helloString);
```

### `ServiceProvider` Examples

#### Retrieve a service from a `ServiceProvider`

The `ServiceProvider` is where we retrieve the service from,
and it stores every service in memory to make sure that you always get the same
instance.

```ts
import {
  ServiceCollection,
  createServiceToken,
  provideValue,
} from '@zeeko/fun-ioc';

const someStringToken = createServiceToken<string>('someString');

const serviceProvider = new ServiceCollection()
  .pipe(provideValue(someStringToken, 'some value'))
  .buildServiceProvider();

const someString = serviceProvider.getService(someStringToken);
```

#### Modify `ServiceProvider`

Once a `ServiceProvider` is created,
it is not recommended to modify the `ServiceCollection` of it
(even it is possible),
instead,
you can use the `ServiceProvider.extends` method to extend the underlying `ServiceCollection`.

```ts
import {
  ServiceCollection,
  createServiceToken,
  provideValue,
} from '@zeeko/fun-ioc';

// let's say we have a service provider `rootProvider` that provides a string 'hello'

const newProvider = rootProvider.extends(
  new ServiceCollection()
    .pipe
    // register new service here
    (),
);
```
