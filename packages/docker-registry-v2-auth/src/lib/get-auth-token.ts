import fetch from 'node-fetch';

function getBasicAuth(username: string, password: string) {
  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  return `Basic ${auth}`;
}

export interface DockerRegistryV2AuthOptions {
  registry: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  auth: {
    username: string;
    password: string;
  };
}

export async function getAuthToken(options: DockerRegistryV2AuthOptions) {
  const basicAuth = getBasicAuth(options.auth.username, options.auth.password);
  const result = await fetch(`${options.registry}${options.path}`, {
    method: options.method,
    headers: {
      Authorization: basicAuth,
    },
  });
  const authenticationInfo = result.headers.get('www-authenticate');
  const realm = authenticationInfo?.match(/realm="(.+?)"/)?.[1];
  const service = authenticationInfo?.match(/service="(.+?)"/)?.[1];
  const scope = authenticationInfo?.match(/scope="(.+?)"/)?.[1];
  const tokenResult = await fetch(
    `${realm}?service=${service}&scope=${scope}`,
    {
      method: 'GET',
      headers: {
        Authorization: basicAuth,
      },
    },
  );
  const token = (await tokenResult.json()) as Record<string, string>;
  return `Bearer ${token['token']}`;
}
