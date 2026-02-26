import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /cities/[pair] → /en/cities/[pair] (locale prefix missing)
      {
        source: '/cities/:pair',
        destination: '/en/cities/:pair',
        permanent: true,
      },
      {
        source: '/cities',
        destination: '/en/cities',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
