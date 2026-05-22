import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /en/cities/[pair] → /[pair]  (old /en/ prefix + /cities/ segment, one-hop)
      { source: '/en/cities/:pair+', destination: '/:pair+', permanent: true },
      // /en → /  (old /en/ prefix root)
      { source: '/en', destination: '/', permanent: true },
      // /en/[path] → /[path]  (old /en/ prefix catchall)
      { source: '/en/:path+', destination: '/:path+', permanent: true },
      // /cities/[pair] → /[pair]  (English)
      { source: '/cities/:pair+', destination: '/:pair+', permanent: true },
      // /ja/cities/[pair] → /ja/[pair]  (Japanese)
      { source: '/ja/cities/:pair+', destination: '/ja/:pair+', permanent: true },
      // /cities → /  (English list page)
      { source: '/cities', destination: '/', permanent: true },
      // /ja/cities → /ja  (Japanese list page)
      { source: '/ja/cities', destination: '/ja', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
