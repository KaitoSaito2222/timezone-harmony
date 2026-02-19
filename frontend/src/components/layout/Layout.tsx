'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Header } from './Header';
import { POPULAR_PAIRS } from '@/lib/cities';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const t = useTranslations('common');
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {children}
      </main>

      {/* Footer: popular city pair links for internal linking */}
      <footer className="border-t mt-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            {t('popularComparisons')}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {POPULAR_PAIRS.map(({ slug, label }) => (
              <Link
                key={slug}
                href={`/cities/${slug}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
}
