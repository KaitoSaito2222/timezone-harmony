import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/*?tz=',
        '/presets', '/auth/', '/login', '/register', '/forgot-password',
        '/ja/presets', '/ja/auth/', '/ja/login', '/ja/register', '/ja/forgot-password',
        '/ko/presets', '/ko/auth/', '/ko/login', '/ko/register', '/ko/forgot-password',
        '/zh/presets', '/zh/auth/', '/zh/login', '/zh/register', '/zh/forgot-password',
        '/es/presets', '/es/auth/', '/es/login', '/es/register', '/es/forgot-password',
        '/fr/presets', '/fr/auth/', '/fr/login', '/fr/register', '/fr/forgot-password',
        '/hi/presets', '/hi/auth/', '/hi/login', '/hi/register', '/hi/forgot-password',
        '/th/presets', '/th/auth/', '/th/login', '/th/register', '/th/forgot-password',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
