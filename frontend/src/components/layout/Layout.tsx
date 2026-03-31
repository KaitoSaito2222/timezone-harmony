'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Header } from './Header';
import { POPULAR_PAIRS, parseCities, getCityLocalized } from '@/lib/cities';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const t = useTranslations('common');
  const locale = useLocale();
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

      {/* Footer: popular city pair links for internal linking */}
      <footer className="border-t mt-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide text-center">
            {t('popularComparisons')}
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
            {POPULAR_PAIRS.map(({ slug }) => {
              const cities = parseCities(slug);
              const label = cities
                ? cities.map(c => getCityLocalized(c, locale).name).join(' ↔ ')
                : slug;
              return (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-6 text-center">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
}
