import { useQueryClient, type QueryKey, type QueryFunction } from "@tanstack/react-query";
import { useCallback } from "react";

import { QUERY_STALE_TIME } from "@/shared/config/constants";

/**
 * Returns an `onMouseEnter` handler that prefetches a query
 * when the user hovers over an element (e.g. a link or card).
 *
 * Usage:
 * ```tsx
 * const prefetch = usePrefetch(courseKeys.detail(id), () => courseRepo.get(id));
 * <Link onMouseEnter={prefetch} to={`/student/courses/${id}`}>…</Link>
 * ```
 */
export function usePrefetch<T>(queryKey: QueryKey, queryFn: QueryFunction<T>) {
  const queryClient = useQueryClient();

  return useCallback(() => {
    void queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: QUERY_STALE_TIME,
    });
  }, [queryClient, queryKey, queryFn]);
}
