/**
 * Centralized application constants.
 *
 * All "magic" numbers and durations live here so they can be tuned
 * from a single place and referenced by name in business logic.
 */

// ── Time (milliseconds) ───────────────────────────────────────────
export const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 min
export const QUERY_GC_TIME = 10 * 60 * 1000; // 10 min
export const QUERY_RETRY_COUNT = 1;
export const MUTATION_RETRY_COUNT = 0;
export const DEBOUNCE_DELAY = 300; // ms
export const TOAST_DURATION = 4000; // ms

// ── Pagination ────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;

// ── Auth ──────────────────────────────────────────────────────────
export const TOKEN_REFRESH_PATH = "/auth/refresh";

// ── localStorage keys ─────────────────────────────────────────────
export const STORAGE_KEYS = {
  accessToken: "peerly_token",
  refreshToken: "peerly_refresh_token",
  auth: "peerly_auth",
  user: "peerly_user",
  role: "peerly_role",
  language: "peerly_language",
  theme: "peerly_theme",
  featureFlags: "peerly_feature_flags",
} as const;
