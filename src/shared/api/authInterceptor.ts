/**
 * Auth interceptor — token management and silent refresh.
 *
 * Extracted from httpClient so that the HTTP layer stays thin
 * and all auth concerns live in one place.
 */

import { STORAGE_KEYS, TOKEN_REFRESH_PATH } from "@/shared/config/constants";
import { env } from "@/shared/config/env";
import { appNavigate } from "@/shared/lib/navigate";
import { storage } from "@/shared/lib/storage";

// ── Token helpers ──────────────────────────────────────────────────

export function getAccessToken(): string | null {
  return storage.get(STORAGE_KEYS.accessToken);
}

export function getRefreshToken(): string | null {
  return storage.get(STORAGE_KEYS.refreshToken);
}

export function setTokens(access: string, refresh?: string): void {
  storage.set(STORAGE_KEYS.accessToken, access);
  if (refresh) storage.set(STORAGE_KEYS.refreshToken, refresh);
}

export function clearTokens(): void {
  storage.remove(STORAGE_KEYS.accessToken);
  storage.remove(STORAGE_KEYS.refreshToken);
}

// ── Silent refresh ─────────────────────────────────────────────────

let refreshPromise: Promise<boolean> | null = null;

export async function tryRefreshToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  // Deduplicate: if a refresh is already in-flight, wait for it
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const base = env.apiUrl ?? "";
      const res = await fetch(`${base}${TOKEN_REFRESH_PATH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (!res.ok) return false;

      const data = (await res.json()) as { accessToken: string; refreshToken?: string };
      setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Handle a 401 response: attempt refresh, redirect to login on failure.
 * Returns `true` if the token was refreshed (caller should retry).
 */
export async function handleUnauthorized(): Promise<boolean> {
  const refreshed = await tryRefreshToken();
  if (refreshed) return true;

  clearTokens();
  storage.remove(STORAGE_KEYS.auth);
  appNavigate("/login");
  return false;
}
