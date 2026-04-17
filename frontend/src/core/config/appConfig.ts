import { env } from './env';

export const appConfig = {
  appName: env.APP_NAME,
  version: env.APP_VERSION,
  environment: env.APP_ENV,
  isDev: env.IS_DEV,
  api: {
    baseUrl: env.API_URL,
    timeoutMs: 10000,
  },
} as const;
