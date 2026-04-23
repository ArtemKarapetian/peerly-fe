/**
 * Minimal HTTP client built on fetch().
 *
 * Authentication is handled by the gateway via httpOnly cookies, so every
 * request sets `credentials: "include"`. On a 401 the client attempts a
 * silent refresh (also cookie-based) and retries once.
 */

import { API_PREFIX } from "@/shared/config/constants";
import { env } from "@/shared/config/env";

import { handleUnauthorized } from "./authInterceptor";

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

function buildUrl(path: string): string {
  const origin = env.apiUrl ?? "";
  // Allow callers to pass either "/api/v1/..." or a bare "/courses/...".
  const full = path.startsWith(API_PREFIX) ? path : `${API_PREFIX}${path}`;
  return `${origin}${full}`;
}

function baseHeaders(extra?: HeadersInit, hasJsonBody = false): HeadersInit {
  return {
    ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
    Accept: "application/json",
    ...(extra as Record<string, string> | undefined),
  };
}

async function parseBody(res: Response): Promise<unknown> {
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = buildUrl(path);
  const hasJsonBody = init.body !== undefined && typeof init.body === "string";

  const doFetch = () =>
    fetch(url, {
      ...init,
      credentials: "include",
      headers: baseHeaders(init.headers, hasJsonBody),
    });

  let res = await doFetch();

  if (res.status === 401) {
    const refreshed = await handleUnauthorized();
    if (refreshed) {
      res = await doFetch();
    } else {
      throw new ApiError(401, null, "Session expired");
    }
  }

  if (!res.ok) {
    const body = await parseBody(res);
    throw new ApiError(res.status, body, `HTTP ${res.status}: ${path}`);
  }

  return (await parseBody(res)) as T;
}

// ── Public API ────────────────────────────────────────────────────

export const http = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, data?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: "POST",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  put: <T>(path: string, data?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: "PUT",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: "DELETE" }),
};
