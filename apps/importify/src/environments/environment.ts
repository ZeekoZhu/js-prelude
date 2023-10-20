import { IEnvironment } from './types';

// this will be replaced by the deployment process
export const environment: IEnvironment = {
  clientId: process.env['APP_CLIENT_ID'] || 'APP_CLIENT_ID',
  redirectUrl: process.env['APP_REDIRECT_URL'] || 'APP_REDIRECT_URL',
};
