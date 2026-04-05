import { z } from "zod";

/**
 * Runtime-validated environment variables.
 *
 * Zod ensures we fail fast if required variables are missing
 * or have the wrong shape, instead of getting cryptic errors later.
 */
const envSchema = z.object({
  apiUrl: z.string().url().optional(),
  sentryDsn: z.string().url().optional(),
  isProd: z.boolean(),
  isDev: z.boolean(),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse({
  apiUrl: (import.meta.env.VITE_API_URL as string | undefined) || undefined,
  sentryDsn: (import.meta.env.VITE_SENTRY_DSN as string | undefined) || undefined,
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
});
