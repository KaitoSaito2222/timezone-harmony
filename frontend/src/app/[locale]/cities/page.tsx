import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Clock } from 'lucide-react';
import { CITIES, POPULAR_PAIRS, CITY_MAP } from '@/lib/cities';

const POPULAR_SLUGS_LIST = [
  'tokyo', 'newyork', 'london', 'paris', 'singapore',
  'sydney', 'dubai', 'seoul', 'shanghai', 'mumbai',
];

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ja' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'citiesPage' });
  const localePath = locale === 'ja' ? '/ja' : '';

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${baseUrl}${localePath}/cities`,
      languages: {
        en: `${baseUrl}/cities`,
        ja: `${baseUrl}/ja/cities`,
        'x-default': `${baseUrl}/cities`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}${localePath}/cities`,
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function CitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'citiesPage' });
  const tPair = await getTranslations({ locale, namespace: 'cityPair' });
  const localePath = locale === 'ja' ? '/ja' : '';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: tPair('breadcrumbHome'), item: `${baseUrl}${localePath}/` },
      { '@type': 'ListItem', position: 2, name: tPair('breadcrumbCities'), item: `${baseUrl}${localePath}/cities` },
    ],
  };

  // For each city, show pairs with popular cities (up to 5 partners)
  const cityPairs = CITIES.map(city => {
    const pairs = POPULAR_SLUGS_LIST
      .filter(slug => slug !== city.slug)
      .slice(0, 5)
      .map(slug => {
        const other = CITY_MAP.get(slug)!;
        const sorted = [city.slug, slug].sort();
        return { slug: sorted.join('-'), label: other.name };
      });
    return { city, pairs };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 max-w-5xl h-14 flex items-center">
          <Link
            href={`${localePath}/`}
            className="flex items-center gap-2 font-semibold text-sm hover:opacity-80 transition-opacity"
          >
            <Clock className="w-4 h-4 text-primary" />
            Timezone Harmony
          </Link>
        </div>
      </header>

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-10 max-w-5xl">
            <nav className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
              <Link href={`${localePath}/`} className="hover:text-foreground transition-colors">
                {tPair('breadcrumbHome')}
              </Link>
              <span>/</span>
              <span className="text-foreground">{tPair('breadcrumbCities')}</span>
            </nav>
            <h1 className="text-3xl font-bold mb-2">{t('heading')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
        </section>

        {/* Popular Pairs */}
        <section className="container mx-auto px-4 py-10 max-w-5xl">
          <h2 className="text-xl font-semibold mb-4">{t('popularPairs')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {POPULAR_PAIRS.map(({ slug, label }) => (
              <Link
                key={slug}
                href={`${localePath}/cities/${slug}`}
                className="rounded-lg border px-4 py-3 text-sm hover:bg-muted transition-colors text-center"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* All Cities */}
        <section className="border-t">
          <div className="container mx-auto px-4 py-10 max-w-5xl">
            <h2 className="text-xl font-semibold mb-6">{t('allCities')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {cityPairs.map(({ city, pairs }) => (
                <div key={city.slug} className="rounded-lg border bg-card p-4">
                  <h3 className="font-semibold mb-2">{city.name}, {city.country}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {pairs.map(({ slug, label }) => (
                      <Link
                        key={slug}
                        href={`${localePath}/cities/${slug}`}
                        className="text-xs rounded-full border px-2.5 py-1 hover:bg-muted transition-colors"
                      >
                        ↔ {label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
