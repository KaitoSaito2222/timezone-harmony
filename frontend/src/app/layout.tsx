import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://timezone-harmony.com'
  ),
};

// Required root layout — [locale]/layout.tsx handles <html>/<body>
export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
