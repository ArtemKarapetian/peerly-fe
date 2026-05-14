// Тихий refresh при 401; токены в httpOnly cookie на стороне гейтвея, клиент их не видит

import { TOKEN_REFRESH_PATH } from "@/shared/config/constants";
import { env } from "@/shared/config/env";

import { clearSession } from "./session";

let refreshPromise: Promise<boolean> | null = null;
let refreshFailed = false;

async function tryRefreshToken(): Promise<boolean> {
  if (refreshFailed) return false;
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

let loggingOut = false;
export function forceLogout(): void {
  if (loggingOut) return;
  loggingOut = true;
  clearSession();
  window.location.replace("/login");
}

export async function handleUnauthorized(): Promise<boolean> {
  const refreshed = await tryRefreshToken();
  if (refreshed) return true;

  refreshFailed = true;
  forceLogout();
  return false;
}
