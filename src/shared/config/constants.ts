// ── Time (ms) ─────────────────────────────────────────────────────
export const QUERY_STALE_TIME = 5 * 60 * 1000;
export const QUERY_GC_TIME = 10 * 60 * 1000;
export const QUERY_RETRY_COUNT = 1;
export const MUTATION_RETRY_COUNT = 0;
export const DEBOUNCE_DELAY = 300;
export const TOAST_DURATION = 4000;

// ── Pagination ────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;

// ── API ───────────────────────────────────────────────────────────
export const API_PREFIX = "/api/v1";
export const TOKEN_REFRESH_PATH = `${API_PREFIX}/auth/refresh`;

// access/refresh токены НЕ храним — гейтвей кладёт их в httpOnly cookies
export const STORAGE_KEYS = {
  session: "peerly_session",
  language: "peerly_language",
  theme: "peerly_theme",
  featureFlags: "peerly_feature_flags",
  demoToolsVisible: "peerly_demo_tools_visible",
} as const;
