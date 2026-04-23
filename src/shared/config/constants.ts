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

// ── API ───────────────────────────────────────────────────────────
export const API_PREFIX = "/api/v1";
export const TOKEN_REFRESH_PATH = `${API_PREFIX}/auth/refresh`;

// ── localStorage keys ─────────────────────────────────────────────
// Note: access / refresh tokens are NOT stored client-side — the
// gateway sets them as httpOnly cookies.
export const STORAGE_KEYS = {
  session: "peerly_session", // JSON: { userId, role, userName }
  language: "peerly_language",
  theme: "peerly_theme",
  featureFlags: "peerly_feature_flags",
} as const;
