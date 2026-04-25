import { z } from "zod";

// apiUrl — origin гейтвея БЕЗ /api/v1 (префикс добавит http-клиент);
// если не задан, репозитории откатываются на in-memory демо
const envSchema = z.object({
  apiUrl: z.string().url().optional(),
  sentryDsn: z.string().url().optional(),
  isProd: z.boolean(),
  isDev: z.boolean(),
});

export type Env = z.infer<typeof envSchema>;

// убираем хвостовой слеш и /api или /api/v1 — http-клиент всё равно добавит /api/v1
function normalize(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.replace(/\/$/, "").replace(/\/api(\/v\d+)?$/, "");
}

export const env: Env = envSchema.parse({
  apiUrl: normalize(import.meta.env.VITE_API_URL as string | undefined),
  sentryDsn: (import.meta.env.VITE_SENTRY_DSN as string | undefined) || undefined,
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
});
