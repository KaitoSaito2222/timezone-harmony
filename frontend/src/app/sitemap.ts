import type { MetadataRoute } from 'next';
import { getAllPairSlugs, getPopularTripletSlugs } from '@/lib/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com';

  const pairSlugs = getAllPairSlugs();
  const tripletSlugs = getPopularTripletSlugs();

  // English city pair pages
  const enPairUrls: MetadataRoute.Sitemap = pairSlugs.map(pair => ({
    url: `${baseUrl}/${pair}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Japanese city pair pages
  const jaPairUrls: MetadataRoute.Sitemap = pairSlugs.map(pair => ({
    url: `${baseUrl}/ja/${pair}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // English triplet pages
  const enTripletUrls: MetadataRoute.Sitemap = tripletSlugs.map(pair => ({
    url: `${baseUrl}/${pair}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Japanese triplet pages
  const jaTripletUrls: MetadataRoute.Sitemap = tripletSlugs.map(pair => ({
    url: `${baseUrl}/ja/${pair}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  // Korean city pair pages
  const koPairUrls: MetadataRoute.Sitemap = pairSlugs.map(pair => ({
    url: `${baseUrl}/ko/${pair}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Korean triplet pages
  const koTripletUrls: MetadataRoute.Sitemap = tripletSlugs.map(pair => ({
    url: `${baseUrl}/ko/${pair}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [
    {
      url: `${baseUrl}`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/ja`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ko`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...enPairUrls,
    ...jaPairUrls,
    ...koPairUrls,
    ...enTripletUrls,
    ...jaTripletUrls,
    ...koTripletUrls,
  ];
}
