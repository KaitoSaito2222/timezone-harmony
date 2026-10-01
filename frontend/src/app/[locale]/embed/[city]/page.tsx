import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DateTime } from 'luxon';
import { setRequestLocale } from 'next-intl/server';

import { CITY_MAP, getCityLocalized } from '@/lib/cities';
import { getLocaleMeta } from '@/i18n/localeConfig';
import { formatOffsetHours } from '@/lib/dst';
import { EmbedClock } from './EmbedClock';

export const revalidate = 3600;
export const dynamicParams = true;

// Embeds are meant to live on other sites; they should never compete in search results.
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city: citySlug } = await params;
  setRequestLocale(locale);

  const city = CITY_MAP.get(citySlug);
  if (!city) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com';
  const { pathPrefix, dateFormat } = getLocaleMeta(locale);
  const lc = getCityLocalized(city, locale);
  const now = DateTime.now().setZone(city.identifier).setLocale(locale);

  return (
    <EmbedClock
      identifier={city.identifier}
      locale={locale}
      cityName={lc.name}
      offset={`UTC${formatOffsetHours(now.offset)}`}
      href={`${baseUrl}${pathPrefix}/time/${city.slug}`}
      initial={{ time: now.toFormat('HH:mm:ss'), date: now.toFormat(dateFormat) }}
    />
  );
}
