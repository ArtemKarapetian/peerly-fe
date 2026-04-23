/**
 * Auth interceptor — silent refresh on 401.
 *
 * All tokens live in httpOnly cookies managed by the gateway, so the
 * client never sees or stores them. We only need to (a) call the refresh
 * endpoint when a request is rejected and (b) route the user to /login
 * when the refresh itself fails.
 */

import { TOKEN_REFRESH_PATH } from "@/shared/config/constants";
import { env } from "@/shared/config/env";
import { appNavigate } from "@/shared/lib/navigate";

import { clearSession } from "./session";

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const base = env.apiUrl ?? "";
      const res = await fetch(`${base}${TOKEN_REFRESH_PATH}`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      return res.ok;
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
 * Returns `true` when the caller should retry the original request.
 */
export async function handleUnauthorized(): Promise<boolean> {
  const refreshed = await tryRefreshToken();
  if (refreshed) return true;

  clearSession();
  appNavigate("/login");
  return false;
}
