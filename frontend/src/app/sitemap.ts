import type { MetadataRoute } from 'next';
import { getAllPairSlugs, getPopularTripletSlugs } from '@/lib/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com';

  const pairSlugs = getAllPairSlugs();
  const tripletSlugs = getPopularTripletSlugs();

  // English city pair pages
  const enPairUrls: MetadataRoute.Sitemap = pairSlugs.map(pair => ({
    url: `${baseUrl}/cities/${pair}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Japanese city pair pages
  const jaPairUrls: MetadataRoute.Sitemap = pairSlugs.map(pair => ({
    url: `${baseUrl}/ja/cities/${pair}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // English triplet pages
  const enTripletUrls: MetadataRoute.Sitemap = tripletSlugs.map(pair => ({
    url: `${baseUrl}/cities/${pair}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.6,
  }));

  // Japanese triplet pages
  const jaTripletUrls: MetadataRoute.Sitemap = tripletSlugs.map(pair => ({
    url: `${baseUrl}/ja/cities/${pair}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.5,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/ja`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...enPairUrls,
    ...jaPairUrls,
    ...enTripletUrls,
    ...jaTripletUrls,
  ];
}
