import { useRef } from 'react';

export function useSubmitGuard() {
  const ref = useRef(false);
  return async (fn: () => Promise<void>) => {
    if (ref.current) return;
    ref.current = true;
    try {
      await fn();
    } finally {
      ref.current = false;
    }
  };
}
