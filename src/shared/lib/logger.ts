// Обёртка над console для нефатальных диагностик. В проде молчит по умолчанию;
// VITE_VERBOSE_LOGS=true включает её на время разбора инцидента.
// Брошенные исключения уходят в Sentry через глобальный error boundary, не сюда.

import { env } from "@/shared/config/env";

const enabled = env.isDev || env.verboseLogs;

export const logger = {
  warn: (...args: unknown[]): void => {
    if (enabled) console.warn(...args);
  },
  error: (...args: unknown[]): void => {
    if (enabled) console.error(...args);
  },
};
