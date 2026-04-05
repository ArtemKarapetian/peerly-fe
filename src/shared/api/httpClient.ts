/**
 * Minimal HTTP client built on fetch().
 *
 * Auth concerns (tokens, refresh, 401 handling) are delegated
 * to authInterceptor so this module stays focused on HTTP semantics.
 */

import { env } from "@/shared/config/env";

import { getAccessToken, handleUnauthorized } from "./authInterceptor";

// ── Error type ────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message: string,
  ) {
    super(message);
  }
}

// ── Internals ─────────────────────────────────────────────────────

function buildHeaders(token: string | null, extra?: HeadersInit): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extra as Record<string, string>),
  };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = env.apiUrl ?? "";
  const token = getAccessToken();

  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: buildHeaders(token, init.headers),
  });

  // 401 — attempt silent refresh, then retry once
  if (res.status === 401) {
    const refreshed = await handleUnauthorized();
    if (refreshed) {
      const newToken = getAccessToken();
      const retry = await fetch(`${base}${path}`, {
        ...init,
        headers: buildHeaders(newToken, init.headers),
      });
      if (retry.ok) return retry.json() as Promise<T>;
    }

    throw new ApiError(401, null, "Session expired");
  }

  if (!res.ok) {
    const body: unknown = await res.json().catch(() => null);
    throw new ApiError(res.status, body, `HTTP ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

// ── Public API ────────────────────────────────────────────────────

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
