import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = localStorage.getItem(key);
      if (item === null) return initialValue;
      return JSON.parse(item) as T;
    } catch {
      // Fallback for legacy unquoted string values (e.g. "horizontal" stored without JSON quotes)
      const raw = localStorage.getItem(key);
      return (raw ?? initialValue) as T;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore write errors (e.g. private browsing quota)
    }
  }, [key, state]);

  return [state, setState];
}
