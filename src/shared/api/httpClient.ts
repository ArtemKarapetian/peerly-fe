import { env } from "@/shared/config/env";
import { appNavigate } from "@/shared/lib/navigate";

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message: string,
  ) {
    super(message);
  }
}

const TOKEN_KEY = "peerly_token";
const REFRESH_TOKEN_KEY = "peerly_refresh_token";

// ── Token helpers ──────────────────────────────────────────────────
export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(access: string, refresh?: string): void {
  localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ── Refresh logic ──────────────────────────────────────────────────
let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  // Deduplicate: if a refresh is already in-flight, wait for it
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const base = env.apiUrl ?? "";
      const res = await fetch(`${base}/auth/refresh`, {
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

// ── Core request ───────────────────────────────────────────────────
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = env.apiUrl ?? "";
  const token = getAccessToken();

  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers as Record<string, string>),
    },
  });

  // Handle 401 — attempt silent token refresh, then retry once
  if (res.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      const newToken = getAccessToken();
      const retry = await fetch(`${base}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
          ...(init.headers as Record<string, string>),
        },
      });
      if (retry.ok) return retry.json() as Promise<T>;
    }

    // Refresh failed — clear auth and redirect to login
    clearTokens();
    localStorage.removeItem("peerly_auth");
    appNavigate("/login");
    throw new ApiError(401, null, "Session expired");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body, `HTTP ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),
  put: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
