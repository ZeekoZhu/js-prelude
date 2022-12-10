import { getAuthToken } from './get-auth-token';
import { expect } from 'vitest';

describe('docker-registry-v2-auth', () => {
  test('should work', async () => {
    const token = await getAuthToken({
      registry: 'https://registry-1.docker.io',
      path: '/v2/zeekozhu/aspnetcore-build-yarn/tags/list',
      method: 'GET',
      auth: {
        username: process.env['DOCKER_USERNAME'] as string,
        password: process.env['DOCKER_PASSWORD'] as string,
      },
    });
    expect(token).toBeTruthy();
    expect(token).toMatch(/^Bearer .+$/);
  });
});
