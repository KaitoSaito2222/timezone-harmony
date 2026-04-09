'use client';

import { useTranslations } from 'next-intl';
import { Header } from './Header';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const t = useTranslations('common');
  const { isLoading: isAuthLoading } = useAuthStore();

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {isAuthLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          children
        )}
      </main>

      <footer className="border-t mt-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-muted-foreground text-center">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
}
