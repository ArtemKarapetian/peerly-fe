import { useState, useEffect, useRef, useCallback } from "react";

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
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
        if (id === counter.current) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      },
    );
  }, deps); // deps are passed dynamically by the caller

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, isLoading, error, refetch: execute };
}
