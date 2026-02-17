import type { Metadata } from 'next';
import { HomePageContent } from './_home/HomePageContent';

export const metadata: Metadata = {
  title: 'World Timezone Comparison',
  description:
    'Compare time zones across the world. Find optimal meeting times for your global team.',
  alternates: {
    canonical: '/',
  },
};

export default function Page() {
  return <HomePageContent />;
}
