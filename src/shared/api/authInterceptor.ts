// Тихий refresh при 401; токены в httpOnly cookie на стороне гейтвея, клиент их не видит

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

// true → можно повторить исходный запрос; false → перекинули на /login
export async function handleUnauthorized(): Promise<boolean> {
  const refreshed = await tryRefreshToken();
  if (refreshed) return true;

  clearSession();
  appNavigate("/login");
  return false;
}
