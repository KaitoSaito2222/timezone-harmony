import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Providers } from '@/components/providers/Providers';
import { Layout } from '@/components/layout/Layout';
import '../globals.css';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: 'Timezone Harmony',
    template: '%s | Timezone Harmony',
  },
  description:
    'Compare time zones across the world. Find optimal meeting times for your global team.',
  keywords: [
    'timezone',
    'time zone converter',
    'world clock',
    'meeting planner',
    'timezone comparison',
    'global team',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Timezone Harmony',
    title: 'Timezone Harmony',
    description:
      'Compare time zones across the world. Find optimal meeting times for your global team.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timezone Harmony',
    description:
      'Compare time zones across the world. Find optimal meeting times for your global team.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Layout>{children}</Layout>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
