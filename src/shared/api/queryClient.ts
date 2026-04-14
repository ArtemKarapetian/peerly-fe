import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  QUERY_STALE_TIME,
  QUERY_GC_TIME,
  QUERY_RETRY_COUNT,
  MUTATION_RETRY_COUNT,
} from "@/shared/config/constants";

import { ApiError } from "./httpClient";

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 403) return "Access denied";
    if (error.status === 404) return "Resource not found";
    if (error.status >= 500) return "Server error — please try again later";
  }
  return "Something went wrong";
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // 401 is handled by authInterceptor — don't toast it
      if (error instanceof ApiError && error.status === 401) return;
      toast.error(getErrorMessage(error));
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) return;
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
