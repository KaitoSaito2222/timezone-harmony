import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { DateTime } from 'luxon';
import { Clock, ArrowRight, Globe, CalendarClock } from 'lucide-react';

import { CITIES, CITY_MAP, parseCities, getAllPairSlugs, type CityDef } from '@/lib/cities';
import { LiveClock } from './_components/LiveClock';

export const revalidate = 3600; // ISR: regenerate every hour to reflect DST changes
export const dynamicParams = true; // on-demand ISR for pages not pre-built

// ───────────────────────────────────────────────
// generateStaticParams: pages to pre-build at compile time
// ───────────────────────────────────────────────
export async function generateStaticParams() {
  const pairs: { pair: string }[] = [];

  // 2-city pairs: all 435
  for (const slug of getAllPairSlugs()) {
    pairs.push({ pair: slug });
  }

  // 3-city triplets: top-10 popular cities only (10C3 = 120 combinations)
  const popularSlugs = [
    'tokyo', 'newyork', 'london', 'paris', 'singapore',
    'sydney', 'dubai', 'seoul', 'shanghai', 'mumbai',
  ];
  for (let i = 0; i < popularSlugs.length; i++)
    for (let j = i + 1; j < popularSlugs.length; j++)
      for (let k = j + 1; k < popularSlugs.length; k++)
        pairs.push({ pair: `${popularSlugs[i]}-${popularSlugs[j]}-${popularSlugs[k]}` });

  return pairs; // 555 pages pre-built at compile time
}

// ───────────────────────────────────────────────
// Metadata
// ───────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const cities = parseCities(pair);
  if (!cities) return { title: 'Not Found' };

  const is3 = cities.length === 3;
  const title = is3
    ? `${cities[0].name}, ${cities[1].name} & ${cities[2].name} Time Comparison`
    : `${cities[0].name} to ${cities[1].name} Time Difference`;

  const description = is3
    ? `Compare current times and time differences between ${cities[0].name}, ${cities[1].name}, and ${cities[2].name}. Find the best meeting times across all three time zones.`
    : `Current time difference between ${cities[0].name} (${cities[0].country}) and ${cities[1].name} (${cities[1].country}). Compare time zones and find optimal meeting times.`;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.netlify.app';

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/cities/${pair}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/cities/${pair}`,
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
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const cities = parseCities(pair);
  if (!cities) notFound();

  // Redirect to canonical URL if slugs are not in alphabetical order
  const sorted = [...cities].sort((a, b) => a.slug.localeCompare(b.slug));
  if (pair !== sorted.map(c => c.slug).join('-')) {
    redirect(`/cities/${sorted.map(c => c.slug).join('-')}`);
  }

  const is3 = cities.length === 3;
  const grid = buildHourlyGrid(cities);
  const relatedPairs = getRelatedPairs(cities);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.netlify.app';

  // Time differences between all city pairs (for Key Facts)
  const cityPairs: { c1: CityDef; c2: CityDef; diffHours: number }[] = [];
  for (let i = 0; i < cities.length; i++)
    for (let j = i + 1; j < cities.length; j++)
      cityPairs.push({ c1: cities[i], c2: cities[j], diffHours: getDiffHours(cities[i].identifier, cities[j].identifier) });

  const formatDiff = (h: number) =>
    h === 0 ? '0 hrs' : `${h % 1 === 0 ? h.toFixed(0) : h.toFixed(1)} hr${h !== 1 ? 's' : ''}`;

  // FAQ: 2 questions that work for both 2-city and 3-city pages
  const cityNames = cities.map(c => c.name);
  const lastCity = cityNames[cityNames.length - 1];
  const otherCities = cityNames.slice(0, -1).join(', ');
  const allCitiesLabel = `${otherCities} and ${lastCity}`;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What are the current UTC offsets for ${allCitiesLabel}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: cities
            .map(c => `${c.name} is currently at UTC${getOffsetLabel(c.identifier)}`)
            .join('. ') + '. These offsets may shift by ±1 hour during daylight saving time transitions.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does daylight saving time affect the time difference?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Countries that observe daylight saving time shift their clocks by 1 hour, which changes the time difference between cities. This page automatically reflects the current offset and is updated hourly.',
        },
      },
    ],
  };

  const pageTitle = is3
    ? `${cities[0].name}, ${cities[1].name} & ${cities[2].name}`
    : `${cities[0].name} ↔ ${cities[1].name}`;

  // URL to open the main app with these cities pre-loaded via query params
  const appUrl = `/?tz=${cities.map(c => encodeURIComponent(c.identifier)).join(',')}`;

  // JSON-LD BreadcrumbList schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Cities', item: `${baseUrl}/cities` },
      { '@type': 'ListItem', position: 3, name: pageTitle, item: `${baseUrl}/cities/${pair}` },
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
          <Link href="/" className="flex items-center gap-2 font-semibold text-sm hover:opacity-80 transition-opacity">
            <Clock className="w-4 h-4 text-primary" />
            Timezone Harmony
          </Link>
          <Link
            href={appUrl}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Open in App
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
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <span>Cities</span>
              <span>/</span>
              <span className="text-foreground">{pageTitle}</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {is3
                ? `${cities[0].name}, ${cities[1].name} & ${cities[2].name} Time Comparison`
                : `${cities[0].name} to ${cities[1].name} Time Difference`}
            </h1>
            <p className="text-muted-foreground mb-10">
              {is3
                ? `Current local times and time zone comparison for ${cities.map(c => c.name).join(', ')}.`
                : `Current local times and time zone offset between ${cities[0].name} and ${cities[1].name}.`}
            </p>

            {/* Live clocks */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {cities.map((city, i) => (
                <div key={city.slug} className="flex items-center gap-6">
                  <LiveClock timezone={city.identifier} cityName={`${city.name}, ${city.country}`} />
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
            24-Hour Time Comparison
          </h2>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-20">UTC</th>
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
                  const allBusiness = cols.every(t => isBusinessHour(t));
                  const someBusiness = cols.some(t => isBusinessHour(t));
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
                      {cols.map((t, ci) => (
                        <td
                          key={ci}
                          className={`px-4 py-2 tabular-nums font-mono ${
                            isBusinessHour(t) ? 'text-foreground font-medium' : 'text-muted-foreground'
                          }`}
                        >
                          {t}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Green rows = business hours (9 AM–5 PM) in all cities.
            Amber rows = business hours in some cities.
          </p>

          {/* Inline CTA: schedule a meeting */}
          <div className="mt-6 flex items-center justify-between rounded-lg border bg-muted/40 px-5 py-4">
            <div className="flex items-center gap-3">
              <CalendarClock className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm">
                <span className="font-medium">Want to schedule a meeting?</span>
                <span className="text-muted-foreground ml-1">
                  Pick any time slot and export it to your calendar.
                </span>
              </p>
            </div>
            <Link
              href={appUrl}
              className="ml-4 shrink-0 inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              Try it
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* ─── Key Facts ─── */}
        <section className="border-t bg-muted/20">
          <div className="container mx-auto px-4 py-10 max-w-5xl">
            <h2 className="text-xl font-semibold mb-6">Key Facts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* UTC offset per city */}
              {cities.map(city => (
                <div key={city.slug} className="rounded-lg border bg-card p-4">
                  <p className="text-sm text-muted-foreground mb-1">UTC Offset</p>
                  <p className="text-2xl font-bold tabular-nums">{getOffsetLabel(city.identifier)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{city.name}, {city.country}</p>
                </div>
              ))}
              {/* Time difference per pair */}
              {cityPairs.map(({ c1, c2, diffHours }) => (
                <div key={`${c1.slug}-${c2.slug}`} className="rounded-lg border bg-card p-4">
                  <p className="text-sm text-muted-foreground mb-1">Time Difference</p>
                  <p className="text-2xl font-bold tabular-nums">{formatDiff(diffHours)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c1.name} vs {c2.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="container mx-auto px-4 py-10 max-w-5xl">
          <h2 className="text-xl font-semibold mb-4">FAQ</h2>
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
              <h2 className="text-xl font-semibold mb-4">Related Comparisons</h2>
              <div className="flex flex-wrap gap-2">
                {relatedPairs.map(({ slug, label }) => (
                  <Link
                    key={slug}
                    href={`/cities/${slug}`}
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
              Plan meetings across any time zone
            </h2>
            <p className="text-muted-foreground mb-8">
              Use Timezone Harmony to compare multiple cities interactively,
              set a specific meeting time, and export events to your calendar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={appUrl}
                className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
              >
                Open {cities.map(c => c.name).join(' & ')} in App
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium hover:bg-muted transition-colors text-sm"
              >
                Compare other cities
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
