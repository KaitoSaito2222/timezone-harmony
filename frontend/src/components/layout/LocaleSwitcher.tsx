'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LOCALES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ja', label: '日本語', short: 'JA' },
  { code: 'ko', label: '한국어', short: 'KO' },
] as const;

export function LocaleSwitcher() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // SSR ではプレースホルダーを返し、Radix の useId カウンターを安定させる
  if (!mounted) return <div className="h-9 w-16" />;

  const handleSwitch = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  const current = LOCALES.find(l => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 px-2">
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">{current?.short ?? locale.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map(l => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => handleSwitch(l.code)}
            className={locale === l.code ? 'font-semibold text-primary' : ''}
          >
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
