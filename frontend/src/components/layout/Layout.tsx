'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const t = useTranslations('common');
  const pathname = usePathname();

  // Embeddable widgets render without the site chrome.
  if (/^(\/[a-z]{2})?\/embed\//.test(pathname)) return <>{children}</>;

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {children}
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
