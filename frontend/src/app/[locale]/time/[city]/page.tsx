import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { DateTime } from 'luxon';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CITIES, CITY_MAP, COUNTRY_ALIASES, POPULAR_SLUGS, getCityLocalized } from '@/lib/cities';
import { routing } from '@/i18n/routing';
import { getLocaleMeta, buildLanguageAlternates } from '@/i18n/localeConfig';
import { findNextOffsetTransition, formatOffsetHours } from '@/lib/dst';
import { CityClock } from './_components/CityClock';
import { EmbedCode } from './_components/EmbedCode';

export const revalidate = 3600;
export const dynamicParams = true;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com';

export async function generateStaticParams() {
  // Single-city pages are cheap, so every city is pre-rendered in every locale.
  return routing.locales.flatMap(locale => CITIES.map(c => ({ locale, city: c.slug })));
}

/** "+2", "-4", "+5:30" — compact form used after the "UTC" prefix. */
function offsetLabel(identifier: string): string {
  return formatOffsetHours(DateTime.now().setZone(identifier).offset);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}): Promise<Metadata> {
  const { locale, city: citySlug } = await params;
  const city = CITY_MAP.get(citySlug);
  if (!city) return { title: 'Not Found' };

  const t = await getTranslations({ locale, namespace: 'cityTime' });
  const lc = getCityLocalized(city, locale);
  const meta = getLocaleMeta(locale);
  const offset = offsetLabel(city.identifier);
  const title = t('title', { city: lc.name, offset });
  const description = t('description', { city: lc.name, country: lc.country, offset });
  const canonicalUrl = `${baseUrl}${meta.pathPrefix}/time/${city.slug}`;

  return {
    title,
    description,
    keywords: [lc.name, ...meta.cityKeywords],
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(baseUrl, `time/${city.slug}`),
    },
    openGraph: { title, description, url: canonicalUrl, locale: meta.ogLocale },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CityTimePage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city: citySlug } = await params;
  setRequestLocale(locale);

  const { pathPrefix: localePath, dateFormat } = getLocaleMeta(locale);

  const city = CITY_MAP.get(citySlug);
  if (!city) {
    const alias = COUNTRY_ALIASES[citySlug.toLowerCase()];
    if (alias) permanentRedirect(`${localePath}/time/${alias}`);
    notFound();
  }

  const t = await getTranslations('cityTime');
  const tp = await getTranslations('cityPair');
  const lc = getCityLocalized(city, locale);
  const offset = offsetLabel(city.identifier);
  const now = DateTime.now().setZone(city.identifier).setLocale(locale);
  const transition = findNextOffsetTransition(city.identifier);

  const compareTargets = POPULAR_SLUGS.filter(s => s !== city.slug).slice(0, 8);
  const otherCities = POPULAR_SLUGS.filter(s => s !== city.slug).slice(0, 10).map(slug => {
    const other = CITY_MAP.get(slug)!;
    const localized = getCityLocalized(other, locale);
    const dt = DateTime.now().setZone(other.identifier);
    return { slug, name: localized.name, time: dt.toFormat('HH:mm'), offset: formatOffsetHours(dt.offset) };
  });

  const dstText = transition
    ? t('dstNext', {
        city: lc.name,
        date: transition.at.setLocale(locale).toFormat(dateFormat),
        from: formatOffsetHours(transition.fromOffset),
        to: formatOffsetHours(transition.toOffset),
      })
    : t('dstNone', { city: lc.name });

  const faq = [
    { q: t('faqQ1', { city: lc.name }), a: t('faqA1', { city: lc.name, offset }) },
    { q: t('faqQ2', { city: lc.name }), a: t('faqA2', { city: lc.name, country: lc.country, tz: city.identifier, offset }) },
    { q: t('faqQ3', { city: lc.name }), a: dstText },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: tp('breadcrumbHome'), item: `${baseUrl}${localePath}/` },
      { '@type': 'ListItem', position: 2, name: lc.name, item: `${baseUrl}${localePath}/time/${city.slug}` },
    ],
  };

  const pairHref = (other: string) => `${localePath}/${[city.slug, other].sort().join('-')}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="min-h-screen bg-background">
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <nav className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
              <Link href={`${localePath}/`} className="hover:text-foreground transition-colors">
                {tp('breadcrumbHome')}
              </Link>
              <span>/</span>
              <span className="text-foreground">{lc.name}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('title', { city: lc.name, offset })}</h1>
            <p className="text-muted-foreground">{t('subtitle', { city: lc.name, country: lc.country })}</p>
            <CityClock
              identifier={city.identifier}
              locale={locale}
              initial={{ time: now.toFormat('HH:mm:ss'), date: now.toFormat(dateFormat) }}
            />
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground mb-1">{t('timezoneLabel')}</p>
              <p className="text-lg font-semibold break-all">{city.identifier}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground mb-1">{tp('utcOffset')}</p>
              <p className="text-2xl font-bold tabular-nums">UTC{offset}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground mb-1">{t('dstLabel')}</p>
              <p className="text-sm leading-relaxed">{dstText}</p>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/20">
          <div className="container mx-auto px-4 py-10 max-w-5xl">
            <h2 className="text-xl font-semibold mb-4">{t('compareHeading', { city: lc.name })}</h2>
            <div className="flex flex-wrap gap-2">
              {compareTargets.map(slug => {
                const other = getCityLocalized(CITY_MAP.get(slug)!, locale);
                return (
                  <Link
                    key={slug}
                    href={pairHref(slug)}
                    className="rounded-full border bg-card px-4 py-1.5 text-sm hover:bg-accent transition-colors"
                  >
                    {lc.name} ↔ {other.name}
                  </Link>
                );
              })}
            </div>
            <Link href={`${localePath}/`} className="mt-5 inline-block text-sm font-medium text-primary hover:underline">
              {t('openApp')} →
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 max-w-5xl">
          <h2 className="text-xl font-semibold mb-4">{t('otherCitiesHeading')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {otherCities.map(c => (
              <Link
                key={c.slug}
                href={`${localePath}/time/${c.slug}`}
                className="rounded-lg border bg-card p-3 hover:bg-accent transition-colors"
              >
                <p className="text-sm font-medium truncate">{c.name}</p>
                <p className="text-xl font-bold tabular-nums font-mono">{c.time}</p>
                <p className="text-xs text-muted-foreground font-mono">UTC{c.offset}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t container mx-auto px-4 py-10 max-w-5xl">
          <h2 className="text-xl font-semibold mb-4">{tp('faq')}</h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div key={i} className="rounded-lg border bg-card p-5">
                <h3 className="font-semibold mb-1.5 text-sm">{item.q}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t bg-muted/20">
          <div className="container mx-auto px-4 py-10 max-w-5xl">
            <h2 className="text-xl font-semibold mb-2">{t('embedHeading')}</h2>
            <p className="text-sm text-muted-foreground mb-4">{t('embedDesc')}</p>
            <EmbedCode src={`${baseUrl}${localePath}/embed/${city.slug}`} title={t('embedTitle', { city: lc.name })} />
          </div>
        </section>
      </main>
    </>
  );
}
