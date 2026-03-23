import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { DateTime } from 'luxon';
import { Clock, ArrowRight, Globe, CalendarClock } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CITIES, CITY_MAP, parseCities, getAllPairSlugs, getCityLocalized, type CityDef } from '@/lib/cities';
import { routing } from '@/i18n/routing';
import { LiveClock } from './_components/LiveClock';

export const revalidate = 3600; // ISR: regenerate every hour to reflect DST changes
export const dynamicParams = true; // on-demand ISR for pages not pre-built

// ───────────────────────────────────────────────
// generateStaticParams: pages to pre-build at compile time
// ───────────────────────────────────────────────
export async function generateStaticParams() {
  const params: { locale: string; pair: string }[] = [];

  // 2-city pairs: all 435
  const pairSlugs = getAllPairSlugs();

  // 3-city triplets: top-10 popular cities only (10C3 = 120 combinations, alphabetical order)
  const popularSlugs = [
    'tokyo', 'newyork', 'london', 'paris', 'singapore',
    'sydney', 'dubai', 'seoul', 'shanghai', 'mumbai',
  ].sort();
  const tripletSlugs: string[] = [];
  for (let i = 0; i < popularSlugs.length; i++)
    for (let j = i + 1; j < popularSlugs.length; j++)
      for (let k = j + 1; k < popularSlugs.length; k++)
        tripletSlugs.push(`${popularSlugs[i]}-${popularSlugs[j]}-${popularSlugs[k]}`);

  const allSlugs = [...pairSlugs, ...tripletSlugs];

  for (const locale of routing.locales) {
    for (const pair of allSlugs) {
      params.push({ locale, pair });
    }
  }

  return params; // 1,110 pages pre-built at compile time (555 × 2 locales)
}

// ───────────────────────────────────────────────
// Metadata
// ───────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pair: string }>;
}): Promise<Metadata> {
  const { locale, pair } = await params;
  const cities = parseCities(pair);
  if (!cities) return { title: 'Not Found' };

  const t = await getTranslations({ locale, namespace: 'cityPair' });
  const is3 = cities.length === 3;
  const lc = cities.map(c => getCityLocalized(c, locale));
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com';

  const title = is3
    ? t('title3', { city1: lc[0].name, city2: lc[1].name, city3: lc[2].name })
    : t('title2', { city1: lc[0].name, city2: lc[1].name });

  const description = is3
    ? t('description3', { city1: lc[0].name, city2: lc[1].name, city3: lc[2].name })
    : t('description2', {
        city1: lc[0].name, country1: lc[0].country,
        city2: lc[1].name, country2: lc[1].country,
      });

  const enUrl = `${baseUrl}/cities/${pair}`;
  const jaUrl = `${baseUrl}/ja/cities/${pair}`;

  const keywords = locale === 'ja'
    ? [...cities.map(c => c.name), '時差', 'タイムゾーン', '現地時刻', '世界時計']
    : [...cities.map(c => c.name), 'time difference', 'timezone', 'local time', 'world clock'];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: locale === 'ja' ? jaUrl : enUrl,
      languages: {
        en: enUrl,
        ja: jaUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: locale === 'ja' ? jaUrl : enUrl,
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// ───────────────────────────────────────────────
// Utility helpers
// ───────────────────────────────────────────────

/** Returns UTC offset string in "+09:00" format */
function getOffsetLabel(timezone: string): string {
  const dt = DateTime.now().setZone(timezone);
  return dt.toFormat('ZZ');
}

/** Returns the absolute time difference in hours between two timezones */
function getDiffHours(tz1: string, tz2: string): number {
  const now = DateTime.now();
  const off1 = now.setZone(tz1).offset; // minutes
  const off2 = now.setZone(tz2).offset;
  return Math.abs(off1 - off2) / 60;
}


/** Returns up to 5 related city pairs sharing the anchor city */
function getRelatedPairs(cities: CityDef[]): { slug: string; label: string }[] {
  const currentSlugs = new Set(cities.map(c => c.slug));
  const related: { slug: string; label: string }[] = [];
  const allSlugs = CITIES.map(c => c.slug);

  // Build pairs from the first city as anchor
  const anchor = cities[0];
  for (const slug of allSlugs) {
    if (currentSlugs.has(slug)) continue;
    const other = CITY_MAP.get(slug)!;
    const sorted = [anchor.slug, slug].sort();
    related.push({
      slug: sorted.join('-'),
      label: `${anchor.name} ↔ ${other.name}`,
    });
    if (related.length >= 5) break;
  }
  return related;
}

/** Builds 24-hour grid data: for each UTC hour, the local time in each city */
function buildHourlyGrid(cities: CityDef[]) {
  const base = DateTime.now().setZone('UTC').startOf('day');
  const rows: { utcHour: number; cols: string[] }[] = [];
  for (let h = 0; h < 24; h++) {
    const utc = base.plus({ hours: h });
    const cols = cities.map(city => utc.setZone(city.identifier).toFormat('HH:mm'));
    rows.push({ utcHour: h, cols });
  }
  return rows;
}

/** Returns true if the time string (HH:mm) falls within business hours (9 AM–5 PM) */
function isBusinessHour(hourStr: string): boolean {
  const h = parseInt(hourStr.split(':')[0], 10);
  return h >= 9 && h < 17;
}

// ───────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────
export default async function CityPairPage({
  params,
}: {
  params: Promise<{ locale: string; pair: string }>;
}) {
  const { locale, pair } = await params;
  setRequestLocale(locale);

  const cities = parseCities(pair);
  if (!cities) notFound();

  const localePath = locale === 'ja' ? '/ja' : '';

  // Redirect to canonical URL if slugs are not in alphabetical order
  const sorted = [...cities].sort((a, b) => a.slug.localeCompare(b.slug));
  if (pair !== sorted.map(c => c.slug).join('-')) {
    permanentRedirect(`${localePath}/cities/${sorted.map(c => c.slug).join('-')}`);
  }

  const t = await getTranslations('cityPair');

  const is3 = cities.length === 3;
  const lc = cities.map(c => getCityLocalized(c, locale));
  const grid = buildHourlyGrid(cities);
  const relatedPairs = getRelatedPairs(cities).map(({ slug }) => {
    const parts = slug.split('-');
    const c1 = CITY_MAP.get(parts[0]);
    const c2 = CITY_MAP.get(parts[1]);
    const n1 = c1 ? getCityLocalized(c1, locale).name : parts[0];
    const n2 = c2 ? getCityLocalized(c2, locale).name : parts[1];
    return { slug, label: `${n1} ↔ ${n2}` };
  });
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com';

  // Time differences between all city pairs (for Key Facts)
  const cityPairs: { c1: CityDef; c2: CityDef; diffHours: number }[] = [];
  for (let i = 0; i < cities.length; i++)
    for (let j = i + 1; j < cities.length; j++)
      cityPairs.push({ c1: lc[i], c2: lc[j], diffHours: getDiffHours(cities[i].identifier, cities[j].identifier) });

  const formatDiff = (h: number) => {
    if (h === 0) return t('diff0');
    if (h % 1 === 0) return h === 1 ? t('diffHour', { h: h.toFixed(0) }) : t('diffHours', { h: h.toFixed(0) });
    return t('diffHours', { h: h.toFixed(1) });
  };

  // FAQ
  const allCitiesLabel = is3
    ? t('citiesLabel3', { city1: lc[0].name, city2: lc[1].name, city3: lc[2].name })
    : t('citiesLabel2', { city1: lc[0].name, city2: lc[1].name });

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t('faqQ1', { cities: allCitiesLabel }),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('faqA1', {
            offsets: cities.map((c, i) => t('faqA1Offset', { city: lc[i].name, offset: getOffsetLabel(c.identifier) })).join('. '),
          }),
        },
      },
      {
        '@type': 'Question',
        name: t('faqQ2'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('faqA2'),
        },
      },
    ],
  };

  const pageTitle = is3
    ? `${lc[0].name}, ${lc[1].name} & ${lc[2].name}`
    : `${lc[0].name} ↔ ${lc[1].name}`;

  // URL to open the main app with these cities pre-loaded via query params
  const appUrl = `${localePath}/?tz=${cities.map(c => encodeURIComponent(c.identifier)).join(',')}`;

  // JSON-LD BreadcrumbList schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('breadcrumbHome'), item: `${baseUrl}${localePath}/` },
      { '@type': 'ListItem', position: 2, name: t('breadcrumbCities'), item: `${baseUrl}${localePath}/cities` },
      { '@type': 'ListItem', position: 3, name: pageTitle, item: `${baseUrl}${localePath}/cities/${pair}` },
    ],
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ─── Sticky top nav ─── */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 max-w-5xl h-14 flex items-center justify-between">
          <Link href={`${localePath}/`} className="flex items-center gap-2 font-semibold text-sm hover:opacity-80 transition-opacity">
            <Clock className="w-4 h-4 text-primary" />
            Timezone Harmony
          </Link>
          <Link
            href={appUrl}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {t('openInApp')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="min-h-screen bg-background">
        {/* ─── Hero ─── */}
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            {/* Breadcrumb */}
            <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-1">
              <Link href={`${localePath}/`} className="hover:text-foreground transition-colors">
                {t('breadcrumbHome')}
              </Link>
              <span>/</span>
              <Link href={`${localePath}/cities`} className="hover:text-foreground transition-colors">
                {t('breadcrumbCities')}
              </Link>
              <span>/</span>
              <span className="text-foreground">{pageTitle}</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {is3
                ? t('title3', { city1: lc[0].name, city2: lc[1].name, city3: lc[2].name })
                : t('title2', { city1: lc[0].name, city2: lc[1].name })}
            </h1>
            <p className="text-muted-foreground mb-10">
              {is3
                ? t('subtitle3', { cities: lc.map(c => c.name).join(', ') })
                : t('subtitle2', { city1: lc[0].name, city2: lc[1].name })}
            </p>

            {/* Live clocks */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {cities.map((city, i) => (
                <div key={city.slug} className="flex items-center gap-6">
                  <LiveClock timezone={city.identifier} cityName={`${lc[i].name}, ${lc[i].country}`} />
                  {i < cities.length - 1 && (
                    <ArrowRight className="text-muted-foreground hidden md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 24-Hour Comparison Grid ─── */}
        <section className="container mx-auto px-4 py-10 max-w-5xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {t('grid24h')}
          </h2>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-20">{t('utcHeader')}</th>
                  {cities.map(city => (
                    <th key={city.slug} className="px-4 py-3 text-left font-medium">
                      {city.name}
                      <span className="ml-1 text-xs text-muted-foreground font-normal">
                        ({getOffsetLabel(city.identifier)})
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.map(({ utcHour, cols }) => {
                  const allBusiness = cols.every(c => isBusinessHour(c));
                  const someBusiness = cols.some(c => isBusinessHour(c));
                  const rowClass = allBusiness
                    ? 'bg-green-50 dark:bg-green-950/20'
                    : someBusiness
                      ? 'bg-amber-50 dark:bg-amber-950/20'
                      : '';
                  return (
                    <tr key={utcHour} className={`border-t ${rowClass}`}>
                      <td className="px-4 py-2 text-muted-foreground tabular-nums">
                        {String(utcHour).padStart(2, '0')}:00
                      </td>
                      {cols.map((time, ci) => (
                        <td
                          key={ci}
                          className={`px-4 py-2 tabular-nums font-mono ${
                            isBusinessHour(time) ? 'text-foreground font-medium' : 'text-muted-foreground'
                          }`}
                        >
                          {time}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t('gridLegend')}
          </p>

          {/* Inline CTA: schedule a meeting */}
          <div className="mt-6 flex items-center justify-between rounded-lg border bg-muted/40 px-5 py-4">
            <div className="flex items-center gap-3">
              <CalendarClock className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm">
                <span className="font-medium">{t('scheduleMeeting')}</span>
                <span className="text-muted-foreground ml-1">
                  {t('scheduleMeetingDesc')}
                </span>
              </p>
            </div>
            <Link
              href={appUrl}
              className="ml-4 shrink-0 inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              {t('tryIt')}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* ─── Key Facts ─── */}
        <section className="border-t bg-muted/20">
          <div className="container mx-auto px-4 py-10 max-w-5xl">
            <h2 className="text-xl font-semibold mb-6">{t('keyFacts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* UTC offset per city */}
              {cities.map((city, i) => (
                <div key={city.slug} className="rounded-lg border bg-card p-4">
                  <p className="text-sm text-muted-foreground mb-1">{t('utcOffset')}</p>
                  <p className="text-2xl font-bold tabular-nums">{getOffsetLabel(city.identifier)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{lc[i].name}, {lc[i].country}</p>
                </div>
              ))}
              {/* Time difference per pair */}
              {cityPairs.map(({ c1, c2, diffHours }) => (
                <div key={`${c1.slug}-${c2.slug}`} className="rounded-lg border bg-card p-4">
                  <p className="text-sm text-muted-foreground mb-1">{t('timeDifference')}</p>
                  <p className="text-2xl font-bold tabular-nums">{formatDiff(diffHours)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('vsLabel', { c1: c1.name, c2: c2.name })}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="container mx-auto px-4 py-10 max-w-5xl">
          <h2 className="text-xl font-semibold mb-4">{t('faq')}</h2>
          <div className="space-y-4">
            {faqJsonLd.mainEntity.map((item, i) => (
              <div key={i} className="rounded-lg border bg-card p-5">
                <h3 className="font-semibold mb-1.5 text-sm">{item.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Related Pages ─── */}
        {relatedPairs.length > 0 && (
          <section className="border-t bg-muted/20">
            <div className="container mx-auto px-4 py-10 max-w-5xl">
              <h2 className="text-xl font-semibold mb-4">{t('relatedComparisons')}</h2>
              <div className="flex flex-wrap gap-2">
                {relatedPairs.map(({ slug, label }) => (
                  <Link
                    key={slug}
                    href={`${localePath}/cities/${slug}`}
                    className="inline-flex items-center gap-1 rounded-full border px-4 py-1.5 text-sm hover:bg-muted transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── CTA ─── */}
        <section className="border-t">
          <div className="container mx-auto px-4 py-12 max-w-5xl text-center">
            <Globe className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {t('planMeetings')}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t('planMeetingsDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={appUrl}
                className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
              >
                {t('openCitiesInApp', { cities: lc.map(c => c.name).join(' & ') })}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`${localePath}/`}
                className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium hover:bg-muted transition-colors text-sm"
              >
                {t('compareOtherCities')}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
