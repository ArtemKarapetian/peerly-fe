import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  QUERY_STALE_TIME,
  QUERY_GC_TIME,
  QUERY_RETRY_COUNT,
  MUTATION_RETRY_COUNT,
} from "@/shared/config/constants";

import { humanizeApiError } from "./errorMessage";
import { ApiError } from "./httpClient";

const GENERIC_FALLBACK = "Something went wrong";

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 403) return humanizeApiError(error, "Access denied");
    if (error.status === 404) return humanizeApiError(error, "Resource not found");
    if (error.status >= 500)
      return humanizeApiError(error, "Server error — please try again later");
    return humanizeApiError(error, GENERIC_FALLBACK);
  }
  return GENERIC_FALLBACK;
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (error instanceof ApiError && error.status === 401) return;
      if (query.meta?.suppressGlobalErrorToast) return;
      toast.error(getErrorMessage(error));
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _vars, _ctx, mutation) => {
      if (error instanceof ApiError && error.status === 401) return;
      if (mutation.meta?.suppressGlobalErrorToast) return;
      toast.error(getErrorMessage(error));
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME,
      gcTime: QUERY_GC_TIME,
      retry: QUERY_RETRY_COUNT,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: MUTATION_RETRY_COUNT,
    },
  },
});
