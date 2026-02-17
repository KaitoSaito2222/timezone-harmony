import type { Metadata } from 'next';
import { AuthCallbackContent } from './AuthCallbackContent';

export const metadata: Metadata = {
  title: 'Completing Authentication',
  robots: { index: false },
};

export default function Page() {
  return <AuthCallbackContent />;
}
