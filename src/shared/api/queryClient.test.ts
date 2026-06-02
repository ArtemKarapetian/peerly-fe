import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { QUERY_RETRY_COUNT, MUTATION_RETRY_COUNT } from "@/shared/config/constants";

import { ApiError } from "./httpClient";
import { queryClient } from "./queryClient";

const { toastErrorMock } = vi.hoisted(() => ({ toastErrorMock: vi.fn() }));
vi.mock("sonner", () => ({ toast: { error: (...args: unknown[]) => toastErrorMock(...args) } }));

describe("queryClient", () => {
  it("exports a QueryClient instance", () => {
    expect(queryClient).toBeInstanceOf(QueryClient);
  });

  it("has a query cache and mutation cache", () => {
    expect(queryClient.getQueryCache()).toBeInstanceOf(QueryCache);
    expect(queryClient.getMutationCache()).toBeInstanceOf(MutationCache);
  });

  it("applies the configured query retry count default", () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.queries?.retry).toBe(QUERY_RETRY_COUNT);
  });

  it("applies the configured mutation retry count default", () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.mutations?.retry).toBe(MUTATION_RETRY_COUNT);
  });

  it("uses non-aggressive defaults when VITE_AGGRESSIVE_REFETCH is unset", () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.queries?.staleTime).toBe(30_000);
    expect(defaults.queries?.gcTime).toBe(5 * 60_000);
    expect(defaults.queries?.refetchOnMount).toBe(false);
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
  });
});

describe("queryClient global error handling", () => {
  beforeEach(() => {
    toastErrorMock.mockReset();
    queryClient.clear();
  });

  async function failingQuery(meta: Record<string, unknown> | undefined, error: Error) {
    await queryClient
      .fetchQuery({
        queryKey: ["qc-error-test"],
        queryFn: () => Promise.reject(error),
        retry: false,
        meta,
      })
      .catch(() => undefined);
  }

  async function failingMutation(meta: Record<string, unknown> | undefined, error: Error) {
    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: () => Promise.reject(error),
      retry: false,
      meta,
    });
    await mutation.execute(undefined).catch(() => undefined);
  }

  it("toasts a query error only when meta.showGlobalErrorToast is set", async () => {
    await failingQuery(undefined, new Error("boom"));
    expect(toastErrorMock).not.toHaveBeenCalled();

    await failingQuery({ showGlobalErrorToast: true }, new Error("boom"));
    expect(toastErrorMock).toHaveBeenCalledTimes(1);
  });

  it("suppresses the query toast for a 401 even when meta is set", async () => {
    await failingQuery({ showGlobalErrorToast: true }, new ApiError(401, null, "unauthorized"));
    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  it("maps an ApiError status to a human message for the query toast", async () => {
    await failingQuery({ showGlobalErrorToast: true }, new ApiError(403, null, "forbidden"));
    expect(toastErrorMock).toHaveBeenCalledWith("Access denied");
  });

  it("toasts a mutation error by default", async () => {
    await failingMutation(undefined, new Error("boom"));
    expect(toastErrorMock).toHaveBeenCalledTimes(1);
  });

  it("suppresses the mutation toast when meta.suppressGlobalErrorToast is set", async () => {
    await failingMutation({ suppressGlobalErrorToast: true }, new Error("boom"));
    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  it("suppresses the mutation toast for a 401", async () => {
    await failingMutation(undefined, new ApiError(401, null, "unauthorized"));
    expect(toastErrorMock).not.toHaveBeenCalled();
  });
});
