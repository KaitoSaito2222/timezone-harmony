import type { Metadata } from 'next';
import { Providers } from '@/components/providers/Providers';
import { Layout } from '@/components/layout/Layout';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.netlify.app'
  ),
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
    locale: 'en_US',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
