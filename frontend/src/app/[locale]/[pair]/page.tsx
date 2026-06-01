import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { DateTime } from 'luxon';
import { Clock } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CITIES, CITY_MAP, parseCities, getAllPairSlugs, getCityLocalized, POPULAR_SLUGS, type CityDef } from '@/lib/cities';
import { routing } from '@/i18n/routing';
import { getLocaleMeta, buildLanguageAlternates } from '@/i18n/localeConfig';
import { CityPairApp } from './_components/CityPairApp';
import { LiveCityTimes } from './_components/LiveCityTimes';

export const revalidate = 3600;
export const dynamicParams = true;

// ───────────────────────────────────────────────
// generateStaticParams
// ───────────────────────────────────────────────
export async function generateStaticParams() {
  const params: { locale: string; pair: string }[] = [];

  const pairSlugs = getAllPairSlugs();

  const sortedPopular = [...POPULAR_SLUGS].sort();
  const tripletSlugs: string[] = [];
  for (let i = 0; i < sortedPopular.length; i++)
    for (let j = i + 1; j < sortedPopular.length; j++)
      for (let k = j + 1; k < sortedPopular.length; k++)
        tripletSlugs.push(`${sortedPopular[i]}-${sortedPopular[j]}-${sortedPopular[k]}`);

  const allSlugs = [...pairSlugs, ...tripletSlugs];

  for (const locale of routing.locales) {
    for (const pair of allSlugs) {
      params.push({ locale, pair });
    }
  }

  return params;
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com';

  const diffH = !is3 ? getDiffHours(cities[0].identifier, cities[1].identifier) : 0;
  const hStr = diffH % 1 === 0 ? diffH.toFixed(0) : diffH.toFixed(1);

  const title = is3
    ? t('title3', { city1: lc[0].name, city2: lc[1].name, city3: lc[2].name })
    : t('title2', { city1: lc[0].name, city2: lc[1].name, h: hStr });

  const description = is3
    ? t('description3', { city1: lc[0].name, city2: lc[1].name, city3: lc[2].name })
    : t('description2', { city1: lc[0].name, city2: lc[1].name, h: hStr, wa: pWa(locale, lc[0].name), neun: pNeun(locale, lc[1].name) });

  const meta = getLocaleMeta(locale);
  const canonicalUrl = `${baseUrl}${meta.pathPrefix}/${canonicalPairSlug(cities)}`;

  return {
    title,
    description,
    keywords: [...lc.map(c => c.name), ...meta.cityKeywords],
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(baseUrl, pair),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      locale: meta.ogLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// ───────────────────────────────────────────────
// Korean particle helpers (받침 check)
// ───────────────────────────────────────────────
function hasBatchim(str: string): boolean {
  if (!str) return false;
  const code = str.charCodeAt(str.length - 1);
  return code >= 0xAC00 && code <= 0xD7A3 && (code - 0xAC00) % 28 !== 0;
}
function pWa(locale: string, word: string) { return locale === 'ko' ? (hasBatchim(word) ? '과' : '와') : ''; }
function pNeun(locale: string, word: string) { return locale === 'ko' ? (hasBatchim(word) ? '은' : '는') : ''; }

// ───────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────
/**
 * Canonical pair slug: cities sorted alphabetically by slug.
 * e.g. "newyork-london" → "london-newyork". Mirrors the alphabetical
 * normalization used by the 308 redirect so canonical always points to
 * the one true URL even when a reverse-order URL is requested.
 */
function canonicalPairSlug(cities: CityDef[]): string {
  return [...cities]
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map(c => c.slug)
    .join('-');
}

function getOffsetLabel(timezone: string): string {
  return DateTime.now().setZone(timezone).toFormat('ZZ');
}

function getDiffHours(tz1: string, tz2: string): number {
  const now = DateTime.now();
  return Math.abs(now.setZone(tz1).offset - now.setZone(tz2).offset) / 60;
}

function getRelatedPairs(cities: CityDef[]): { slug: string; label: string }[] {
  const currentSlugs = new Set(cities.map(c => c.slug));
  const related: { slug: string; label: string }[] = [];
  const anchor = cities[0];
  for (const slug of CITIES.map(c => c.slug)) {
    if (currentSlugs.has(slug)) continue;
    const other = CITY_MAP.get(slug)!;
    const sorted = [anchor.slug, slug].sort();
    related.push({ slug: sorted.join('-'), label: `${anchor.name} ↔ ${other.name}` });
    if (related.length >= 5) break;
  }
  return related;
}

function buildHourlyGrid(cities: CityDef[]) {
  const base = DateTime.now().setZone('UTC').startOf('day');
  return Array.from({ length: 24 }, (_, h) => {
    const utc = base.plus({ hours: h });
    return { utcHour: h, cols: cities.map(city => utc.setZone(city.identifier).toFormat('HH:mm')) };
  });
}

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

  const { pathPrefix: localePath, dateFormat } = getLocaleMeta(locale);

  // Redirect to canonical (alphabetical) URL
  const sorted = [...cities].sort((a, b) => a.slug.localeCompare(b.slug));
  if (pair !== sorted.map(c => c.slug).join('-')) {
    permanentRedirect(`${localePath}/${sorted.map(c => c.slug).join('-')}`);
  }

  const t = await getTranslations('cityPair');
  const is3 = cities.length === 3;
  const lc = cities.map(c => getCityLocalized(c, locale));
  const grid = buildHourlyGrid(cities);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com';

  const relatedPairs = getRelatedPairs(cities).map(({ slug }) => {
    const parts = slug.split('-');
    const c1 = CITY_MAP.get(parts[0]);
    const c2 = CITY_MAP.get(parts[1]);
    const n1 = c1 ? getCityLocalized(c1, locale).name : parts[0];
    const n2 = c2 ? getCityLocalized(c2, locale).name : parts[1];
    return { slug, label: `${n1} ↔ ${n2}` };
  });

  const cityPairs: { c1: CityDef; c2: CityDef; diffHours: number }[] = [];
  for (let i = 0; i < cities.length; i++)
    for (let j = i + 1; j < cities.length; j++)
      cityPairs.push({ c1: lc[i], c2: lc[j], diffHours: getDiffHours(cities[i].identifier, cities[j].identifier) });

  const h1HStr = !is3 && cityPairs[0]
    ? (cityPairs[0].diffHours % 1 === 0 ? cityPairs[0].diffHours.toFixed(0) : cityPairs[0].diffHours.toFixed(1))
    : '0';

  const formatDiff = (h: number) => {
    if (h === 0) return t('diff0');
    if (h % 1 === 0) return h === 1 ? t('diffHour', { h: h.toFixed(0) }) : t('diffHours', { h: h.toFixed(0) });
    return t('diffHours', { h: h.toFixed(1) });
  };

  const pageTitle = is3
    ? `${lc[0].name}, ${lc[1].name} & ${lc[2].name}`
    : `${lc[0].name} ↔ ${lc[1].name}`;

  const allCitiesLabel = is3
    ? t('citiesLabel3', { city1: lc[0].name, city2: lc[1].name, city3: lc[2].name, wa: pWa(locale, lc[1].name) })
    : t('citiesLabel2', { city1: lc[0].name, city2: lc[1].name, wa: pWa(locale, lc[0].name) });

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
            offsets: cities.map((c, i) => t('faqA1Offset', { city: lc[i].name, offset: getOffsetLabel(c.identifier), neun: pNeun(locale, lc[i].name) })).join('. '),
          }),
        },
      },
      {
        '@type': 'Question',
        name: t('faqQ2'),
        acceptedAnswer: { '@type': 'Answer', text: t('faqA2') },
      },
    ],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('breadcrumbHome'), item: `${baseUrl}${localePath}/` },
      { '@type': 'ListItem', position: 2, name: pageTitle, item: `${baseUrl}${localePath}/${pair}` },
    ],
  };

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="min-h-screen bg-background">
        {/* Hero / breadcrumb */}
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <nav className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
              <Link href={`${localePath}/`} className="hover:text-foreground transition-colors">
                {t('breadcrumbHome')}
              </Link>
              <span>/</span>
              <span className="text-foreground">{pageTitle}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {is3
                ? t('title3', { city1: lc[0].name, city2: lc[1].name, city3: lc[2].name })
                : t('title2', { city1: lc[0].name, city2: lc[1].name, h: h1HStr })}
            </h1>
            <p className="text-muted-foreground">
              {is3
                ? t('subtitle3', { cities: lc.map(c => c.name).join(', ') })
                : t('subtitle2', { city1: lc[0].name, city2: lc[1].name, wa: pWa(locale, lc[0].name) })}
            </p>

            {/* Live current times — SSR initial values, Client updates every second */}
            <LiveCityTimes
              cities={cities.map((city, i) => ({
                name: lc[i].name,
                identifier: city.identifier,
                offset: `UTC${getOffsetLabel(city.identifier)}`,
              }))}
              initialStates={cities.map(city => {
                const dt = DateTime.now().setZone(city.identifier).setLocale(locale);
                return {
                  time: dt.toFormat('HH:mm'),
                  date: dt.toFormat(dateFormat),
                  ordinal: dt.ordinal,
                };
              })}
              diffLabel={!is3 ? formatDiff(cityPairs[0].diffHours) : undefined}
              locale={locale}
            />
          </div>
        </section>

        {/* Interactive app */}
        <section className="container mx-auto px-4 py-8 max-w-5xl">
          <CityPairApp defaultIdentifiers={cities.map(c => c.identifier)} />
        </section>

        {/* 24-Hour Reference Grid */}
        <section className="border-t container mx-auto px-4 py-10 max-w-5xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {t('grid24h')}
          </h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-20">{t('utcHeader')}</th>
                  {cities.map((city, i) => (
                    <th key={city.slug} className="px-4 py-3 text-left font-medium">
                      {lc[i].name}
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
          <p className="text-xs text-muted-foreground mt-2">{t('gridLegend')}</p>
        </section>

        {/* Key Facts */}
        <section className="border-t bg-muted/20">
          <div className="container mx-auto px-4 py-10 max-w-5xl">
            <h2 className="text-xl font-semibold mb-6">{t('keyFacts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {cities.map((city, i) => (
                <div key={city.slug} className="rounded-lg border bg-card p-4">
                  <p className="text-sm text-muted-foreground mb-1">{t('utcOffset')}</p>
                  <p className="text-2xl font-bold tabular-nums">{getOffsetLabel(city.identifier)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{lc[i].name}, {lc[i].country}</p>
                </div>
              ))}
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

        {/* FAQ */}
        <section className="container mx-auto px-4 py-10 max-w-5xl">
          <h2 className="text-xl font-semibold mb-4">{t('faq')}</h2>
          <div className="space-y-4">
            {faqJsonLd.mainEntity.map((item, i) => (
              <div key={i} className="rounded-lg border bg-card p-5">
                <h3 className="font-semibold mb-1.5 text-sm">{item.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Pages */}
        {relatedPairs.length > 0 && (
          <section className="border-t bg-muted/20">
            <div className="container mx-auto px-4 py-10 max-w-5xl">
              <h2 className="text-xl font-semibold mb-4">{t('relatedComparisons')}</h2>
              <div className="flex flex-wrap gap-2">
                {relatedPairs.map(({ slug, label }) => (
                  <Link
                    key={slug}
                    href={`${localePath}/${slug}`}
                    className="inline-flex items-center gap-1 rounded-full border px-4 py-1.5 text-sm hover:bg-muted transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
