declare module "*.png" {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly MODE: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
  readonly BASE_URL: string;
  readonly VITE_API_URL?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_ENABLE_PASSWORD_CHANGE?: string;
  readonly VITE_AGGRESSIVE_REFETCH?: string;
  readonly VITE_VERBOSE_LOGS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
