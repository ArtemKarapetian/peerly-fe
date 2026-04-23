/**
 * Minimal HTTP client built on fetch().
 */

import { API_PREFIX } from "@/shared/config/constants";
import { env } from "@/shared/config/env";
import { appNavigate } from "@/shared/lib/navigate";

import { handleUnauthorized } from "./authInterceptor";

export type HttpErrorMode = "inline" | "redirect";

export interface HttpOptions extends RequestInit {
  onError?: HttpErrorMode;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message: string,
  ) {
    super(message);
  }
}

const REDIRECTABLE_STATUSES: Record<number, string> = {
  403: "/403",
  404: "/404",
  500: "/500",
};

function buildUrl(path: string): string {
  const origin = env.apiUrl ?? "";
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

function maybeRedirect(status: number, mode: HttpErrorMode): void {
  if (mode !== "redirect") return;
  const target = REDIRECTABLE_STATUSES[status];
  if (target) appNavigate(target);
}

async function request<T>(path: string, init: HttpOptions = {}): Promise<T> {
  const { onError = "inline", ...fetchInit } = init;
  const url = buildUrl(path);
  const hasJsonBody = fetchInit.body !== undefined && typeof fetchInit.body === "string";

  const doFetch = () =>
    fetch(url, {
      ...fetchInit,
      credentials: "include",
      headers: baseHeaders(fetchInit.headers, hasJsonBody),
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
    maybeRedirect(res.status, onError);
    throw new ApiError(res.status, body, `HTTP ${res.status}: ${path}`);
  }

  return (await parseBody(res)) as T;
}

export const http = {
  get: <T>(path: string, init?: HttpOptions) => request<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, data?: unknown, init?: HttpOptions) =>
    request<T>(path, {
      ...init,
      method: "POST",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  put: <T>(path: string, data?: unknown, init?: HttpOptions) =>
    request<T>(path, {
      ...init,
      method: "PUT",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(path: string, init?: HttpOptions) => request<T>(path, { ...init, method: "DELETE" }),
};
