import { useQueryClient, type QueryKey, type QueryFunction } from "@tanstack/react-query";
import { useCallback } from "react";

import { QUERY_STALE_TIME } from "@/shared/config/constants";

// onMouseEnter-handler, который префетчит query — вешать на ссылки и карточки
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
