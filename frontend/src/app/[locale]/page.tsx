import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getLocaleMeta, buildLanguageAlternates } from '@/i18n/localeConfig';
import { CITY_MAP, POPULAR_SLUGS, getCityLocalized } from '@/lib/cities';
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
  const meta = getLocaleMeta(locale);
  const canonicalUrl = `${baseUrl}${meta.pathPrefix}`;

  return {
    title: t('title'),
    description: t('description'),
    keywords: meta.homeKeywords,
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: canonicalUrl,
      locale: meta.ogLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(baseUrl),
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
  const localePath = getLocaleMeta(locale).pathPrefix;

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

      {/* Server-rendered heading and intro so the page has indexable text. */}
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{t('h1')}</h1>
        <p className="mt-2 text-muted-foreground">{t('lead')}</p>
      </header>

      <HomePageContent />

      <section className="mt-10 border-t pt-8">
        <h2 className="text-xl font-semibold mb-3">{t('aboutHeading')}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          {t('aboutBody')}
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-3">{t('citiesHeading')}</h2>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SLUGS.map(slug => (
            <Link
              key={slug}
              href={`${localePath}/time/${slug}`}
              className="rounded-full border px-4 py-1.5 text-sm hover:bg-muted transition-colors"
            >
              {getCityLocalized(CITY_MAP.get(slug)!, locale).name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
