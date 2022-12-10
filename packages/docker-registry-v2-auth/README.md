# docker-registry-v2-auth

This package handles the [authentication](https://docs.docker.com/registry/spec/auth/token/) when you want to use the docker registry v2 api.

## Usage

```js
import { getAuthToken } from '@zeeko/docker-registry-v2-auth';

const token = await getAuthToken({
  registry: 'https://registry-1.docker.io',
  method: 'GET',
  path: '/v2/<repository>/tags/list',
  auth: {
    username: 'username',
    password: 'password',
  },
});

// then use the token in the Authorization header

const result = await fetch(
  'https://registry-1.docker.io/v2/<repository>/tags/list',
  {
    headers: {
      Authorization: token,
    },
  },
);
```

## Building

Run `nx build docker-registry-v2-auth` to build the library.
