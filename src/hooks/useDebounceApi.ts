import { useCallback, useEffect, useRef } from "react";

interface UseDebounceApiOptions {
  delay?: number;
  immediate?: boolean;
}

export const useDebounceApi = <T extends (...args: any[]) => Promise<any>>(
  callback: T,
  options: UseDebounceApiOptions = {}
): [(...args: Parameters<T>) => Promise<ReturnType<T>>, () => void] => {
  const { delay = 300, immediate = false } = options;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      cancel();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (immediate) {
        return callback(...args);
      }

      return new Promise<ReturnType<T>>((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            const result = await callback(...args, {
              signal: controller.signal,
            });
            if (!controller.signal.aborted) {
              resolve(result);
            }
          } catch (err) {
            if (!controller.signal.aborted) {
              reject(err);
            }
          }
        }, delay);
      });
    },
    [callback, delay, immediate, cancel]
  );

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return [debouncedFn, cancel];
};

export default useDebounceApi;
