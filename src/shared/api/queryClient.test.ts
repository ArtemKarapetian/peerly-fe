import { QueryClient } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";

import { QUERY_RETRY_COUNT, MUTATION_RETRY_COUNT } from "@/shared/config/constants";

import { queryClient } from "./queryClient";

describe("queryClient", () => {
  it("exports a QueryClient instance", () => {
    expect(queryClient).toBeInstanceOf(QueryClient);
  });

  it("has a query cache and mutation cache", () => {
    expect(queryClient.getQueryCache()).toBeDefined();
    expect(queryClient.getMutationCache()).toBeDefined();
  });

  it("applies the configured query retry count default", () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.queries?.retry).toBe(QUERY_RETRY_COUNT);
  });

  it("applies the configured mutation retry count default", () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.mutations?.retry).toBe(MUTATION_RETRY_COUNT);
  });

  it("disables refetchOnWindowFocus by default", () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
  });

  it("sets non-zero staleTime and gcTime defaults", () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.queries?.staleTime).toBeGreaterThan(0);
    expect(defaults.queries?.gcTime).toBeGreaterThan(0);
  });
});
