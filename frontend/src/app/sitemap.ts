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

  // Chinese city pair pages
  const zhPairUrls: MetadataRoute.Sitemap = pairSlugs.map(pair => ({
    url: `${baseUrl}/zh/${pair}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Chinese triplet pages
  const zhTripletUrls: MetadataRoute.Sitemap = tripletSlugs.map(pair => ({
    url: `${baseUrl}/zh/${pair}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  // Spanish city pair pages
  const esPairUrls: MetadataRoute.Sitemap = pairSlugs.map(pair => ({
    url: `${baseUrl}/es/${pair}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Spanish triplet pages
  const esTripletUrls: MetadataRoute.Sitemap = tripletSlugs.map(pair => ({
    url: `${baseUrl}/es/${pair}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  // French city pair pages
  const frPairUrls: MetadataRoute.Sitemap = pairSlugs.map(pair => ({
    url: `${baseUrl}/fr/${pair}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // French triplet pages
  const frTripletUrls: MetadataRoute.Sitemap = tripletSlugs.map(pair => ({
    url: `${baseUrl}/fr/${pair}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  // Hindi city pair pages
  const hiPairUrls: MetadataRoute.Sitemap = pairSlugs.map(pair => ({
    url: `${baseUrl}/hi/${pair}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Hindi triplet pages
  const hiTripletUrls: MetadataRoute.Sitemap = tripletSlugs.map(pair => ({
    url: `${baseUrl}/hi/${pair}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  // Thai city pair pages
  const thPairUrls: MetadataRoute.Sitemap = pairSlugs.map(pair => ({
    url: `${baseUrl}/th/${pair}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Thai triplet pages
  const thTripletUrls: MetadataRoute.Sitemap = tripletSlugs.map(pair => ({
    url: `${baseUrl}/th/${pair}`,
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
    {
      url: `${baseUrl}/zh`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/es`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fr`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hi`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/th`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...enPairUrls,
    ...jaPairUrls,
    ...koPairUrls,
    ...zhPairUrls,
    ...esPairUrls,
    ...frPairUrls,
    ...hiPairUrls,
    ...thPairUrls,
    ...enTripletUrls,
    ...jaTripletUrls,
    ...koTripletUrls,
    ...zhTripletUrls,
    ...esTripletUrls,
    ...frTripletUrls,
    ...hiTripletUrls,
    ...thTripletUrls,
  ];
}
