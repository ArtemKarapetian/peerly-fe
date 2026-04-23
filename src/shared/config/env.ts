import { z } from "zod";

/**
 * Runtime-validated environment variables.
 *
 * `apiUrl` should be the gateway origin WITHOUT the /api/v1 prefix
 * (the prefix is applied in the http client). If unset, all entity
 * repos fall back to in-memory demo data.
 */
const envSchema = z.object({
  apiUrl: z.string().url().optional(),
  sentryDsn: z.string().url().optional(),
  isProd: z.boolean(),
  isDev: z.boolean(),
});

export type Env = z.infer<typeof envSchema>;

function normalize(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.replace(/\/$/, "");
}

export const env: Env = envSchema.parse({
  apiUrl: normalize(import.meta.env.VITE_API_URL as string | undefined),
  sentryDsn: (import.meta.env.VITE_SENTRY_DSN as string | undefined) || undefined,
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
});
