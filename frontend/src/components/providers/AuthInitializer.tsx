'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function AuthInitializer() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  return null;
}
