import type { MetadataRoute } from 'next';
import { CITIES, getIndexablePairSlugs } from '@/lib/cities';
import { routing } from '@/i18n/routing';
import { getLocaleMeta } from '@/i18n/localeConfig';

/**
 * Only pages that are meant to be indexed are listed here:
 * the home page, every single-city page, and the popular city pairs.
 * Other pair / triplet pages still work for visitors but are noindex
 * (see `[pair]/page.tsx`), so they stay out of the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com';

  const pairSlugs = getIndexablePairSlugs();

  return routing.locales.flatMap((locale): MetadataRoute.Sitemap => {
    const prefix = getLocaleMeta(locale).pathPrefix;
    const isDefault = prefix === '';

    return [
      {
        url: `${baseUrl}${prefix}`,
        changeFrequency: 'weekly',
        priority: isDefault ? 1 : 0.9,
      },
      ...CITIES.map(city => ({
        url: `${baseUrl}${prefix}/time/${city.slug}`,
        changeFrequency: 'weekly' as const,
        priority: isDefault ? 0.8 : 0.7,
      })),
      ...pairSlugs.map(pair => ({
        url: `${baseUrl}${prefix}/${pair}`,
        changeFrequency: 'weekly' as const,
        priority: isDefault ? 0.8 : 0.7,
      })),
    ];
  });
}
