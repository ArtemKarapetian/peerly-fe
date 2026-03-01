export const env = {
  apiUrl: import.meta.env.VITE_API_URL as string | undefined,
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
} as const;
