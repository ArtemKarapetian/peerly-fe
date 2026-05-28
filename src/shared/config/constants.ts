export const QUERY_RETRY_COUNT = 1;
export const MUTATION_RETRY_COUNT = 0;

// ── API ───────────────────────────────────────────────────────────
export const API_PREFIX = "/api/v1";
export const TOKEN_REFRESH_PATH = `${API_PREFIX}/auth/refresh`;

// access/refresh токены НЕ храним — гейтвей кладёт их в httpOnly cookies
export const STORAGE_KEYS = {
  session: "peerly_session",
  language: "peerly_language",
  theme: "peerly_theme",
  pendingVerificationEmail: "peerly_pending_verification_email",
} as const;
