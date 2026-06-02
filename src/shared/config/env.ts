import { z } from "zod";

const envSchema = z.object({
  apiUrl: z.string().url().optional(),
  sentryDsn: z.string().url().optional(),
  isProd: z.boolean(),
  isDev: z.boolean(),
  aggressiveRefetch: z.boolean(),
  verboseLogs: z.boolean(),
});

export type Env = z.infer<typeof envSchema>;

function normalize(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.replace(/\/$/, "").replace(/\/api(\/v\d+)?$/, "");
}

function parseBool(raw: string | undefined): boolean {
  if (!raw) return false;
  const v = raw.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export const env: Env = envSchema.parse({
  apiUrl: normalize(import.meta.env.VITE_API_URL),
  sentryDsn: import.meta.env.VITE_SENTRY_DSN || undefined,
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
  aggressiveRefetch: parseBool(import.meta.env.VITE_AGGRESSIVE_REFETCH),
  verboseLogs: parseBool(import.meta.env.VITE_VERBOSE_LOGS),
});
