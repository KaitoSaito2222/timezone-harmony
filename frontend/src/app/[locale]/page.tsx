import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HomePageContent } from './_home/HomePageContent';

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  const keywords = locale === 'ja'
    ? ['タイムゾーン', '時差', '世界時計', 'ミーティング計画', 'タイムゾーン比較', 'グローバルチーム']
    : ['timezone', 'time zone converter', 'world clock', 'meeting planner', 'timezone comparison', 'global team'];

  return {
    title: t('title'),
    description: t('description'),
    keywords,
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: locale === 'ja' ? `${baseUrl}/ja` : `${baseUrl}`,
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: locale === 'ja' ? `${baseUrl}/ja` : `${baseUrl}`,
      languages: {
        en: `${baseUrl}`,
        ja: `${baseUrl}/ja`,
        'x-default': `${baseUrl}`,
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'home' });

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Timezone Harmony',
    url: baseUrl,
  };

  const webAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Timezone Harmony',
    url: baseUrl,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    description: t('description'),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      {/*
       * Structured data (JSON-LD) for search engines.
       * Tells Google this is a free web app, improving how it appears in search results.
       */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />

      <HomePageContent />
    </>
  );
}
