const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('API URL não configurada');
}

export const env = {
  API_URL,
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME ?? 'AgroTracker',
  APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION ?? '1.0.0',
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  IS_DEV: process.env.EXPO_PUBLIC_APP_ENV
    ? process.env.EXPO_PUBLIC_APP_ENV === 'development'
    : __DEV__,
} as const;
