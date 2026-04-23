import { useState, useEffect, useRef, useCallback } from "react";

import { ApiError, type HttpErrorMode } from "@/shared/api/httpClient";
import { appNavigate } from "@/shared/lib/navigate";

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseAsyncOptions {
  onError?: HttpErrorMode;
}

const REDIRECT_TARGETS: Record<number, string> = {
  403: "/403",
  404: "/404",
  500: "/500",
};

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: unknown[] = [],
  options: UseAsyncOptions = {},
): AsyncState<T> {
  const { onError = "inline" } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const counter = useRef(0);

  const execute = useCallback(() => {
    const id = ++counter.current;
    setIsLoading(true);
    setError(null);

    fn().then(
      (result) => {
        if (id === counter.current) {
          setData(result);
          setIsLoading(false);
        }
      },
      (err) => {
        if (id !== counter.current) return;

        if (onError === "redirect" && err instanceof ApiError) {
          const target = REDIRECT_TARGETS[err.status];
          if (target) {
            appNavigate(target);
            setIsLoading(false);
            return;
          }
        }

        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      },
    );
  }, deps); // deps are passed dynamically by the caller

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, isLoading, error, refetch: execute };
}
