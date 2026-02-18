import type { Metadata } from 'next';
import { HomePageContent } from './_home/HomePageContent';

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com';

export const metadata: Metadata = {
  title: 'World Timezone Comparison',
  description:
    'Compare time zones across the world. Find optimal meeting times for your global team.',
  alternates: {
    canonical: '/',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Timezone Harmony',
  url: baseUrl,
};

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Timezone Harmony',
  url: baseUrl,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  description:
    'Compare time zones across the world. Find optimal meeting times for your global team.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function Page() {
  return (
    <>
      {/*
       * Structured data (JSON-LD) for search engines.
       * Tells Google this is a free web app, improving how it appears in search results.
       */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />

      <HomePageContent />
    </>
  );
}
