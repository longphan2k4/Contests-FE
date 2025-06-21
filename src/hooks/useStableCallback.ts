import { useCallback, useRef, useMemo } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

// Deep comparison utility
const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
};

// Hook to create stable object references
export const useStableObject = <T extends Record<string, any>>(obj: T): T => {
  const ref = useRef<T>(obj);
  
  return useMemo(() => {
    if (!deepEqual(ref.current, obj)) {
      ref.current = obj;
    }
    return ref.current;
  }, [obj]);
};

// Hook to create stable callback with stable dependencies
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
): T => {
  const stableDeps = useStableObject(deps);
  
  return useCallback(callback, stableDeps) as T;
};

// Hook to handle batch state updates
export const useBatchUpdate = () => {
  return useCallback((updates: (() => void)[]) => {
    // React 18 tự động batch updates, nhưng để tương thích với các phiên bản cũ
    if (unstable_batchedUpdates) {
      unstable_batchedUpdates(() => {
        updates.forEach(update => update());
      });
    } else {
      // React 18 automatically batches updates
      updates.forEach(update => update());
    }
  }, []);
};

export default useStableCallback; 