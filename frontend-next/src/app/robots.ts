import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.netlify.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/presets', '/auth/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
