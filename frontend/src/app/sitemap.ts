import type { MetadataRoute } from 'next';
import { getAllPairSlugs, getPopularTripletSlugs } from '@/lib/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.netlify.app';

  const pairUrls: MetadataRoute.Sitemap = getAllPairSlugs().map(pair => ({
    url: `${baseUrl}/cities/${pair}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const tripletUrls: MetadataRoute.Sitemap = getPopularTripletSlugs().map(pair => ({
    url: `${baseUrl}/cities/${pair}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...pairUrls,
    ...tripletUrls,
  ];
}
