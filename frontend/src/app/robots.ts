import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/en/presets', '/en/auth/', '/ja/presets', '/ja/auth/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
