import { useCallback, useRef, useEffect } from 'react';

interface UseDebounceApiOptions {
  delay?: number;
  immediate?: boolean;
}

export const useDebounceApi = <T extends (...args: any[]) => Promise<any>>(
  callback: T,
  options: UseDebounceApiOptions = {}
): [T, () => void] => {
  const { delay = 300, immediate = false } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // Cancel previous request
  const cancelPreviousRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Debounced function
  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      cancelPreviousRequest();

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      if (immediate) {
        return callback(...args);
      }

      return new Promise<ReturnType<T>>((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            // Pass abort signal to callback if it accepts it
            const result = await callback(...args, { signal });
            if (!signal.aborted) {
              resolve(result);
            }
          } catch (error: any) {
            if (!signal.aborted) {
              reject(error);
            }
          }
        }, delay);
      });
    }) as T,
    [callback, delay, immediate, cancelPreviousRequest]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelPreviousRequest();
    };
  }, [cancelPreviousRequest]);

  return [debouncedCallback, cancelPreviousRequest];
};

export default useDebounceApi; 