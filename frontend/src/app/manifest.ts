import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Timezone Harmony',
    short_name: 'Timezone',
    description: 'Compare time zones and find the best meeting time for your global team.',
    start_url: '/?source=pwa',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    icons: [
      { src: '/pwa-icon/192', sizes: '192x192', type: 'image/png' },
      { src: '/pwa-icon/512', sizes: '512x512', type: 'image/png' },
      { src: '/pwa-icon/512', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
