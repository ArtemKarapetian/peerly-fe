/**
 * Minimal HTTP client built on fetch().
 */

import { API_PREFIX } from "@/shared/config/constants";
import { env } from "@/shared/config/env";

import { handleUnauthorized } from "./authInterceptor";
import { redirectForStatus } from "./errorRedirect";

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
    if (onError === "redirect") redirectForStatus(res.status);
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
