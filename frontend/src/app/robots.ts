import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
      '/presets', '/auth/', '/login', '/register', '/forgot-password',
      '/ja/presets', '/ja/auth/', '/ja/login', '/ja/register', '/ja/forgot-password',
    ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
