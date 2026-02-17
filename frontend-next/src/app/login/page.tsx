import type { Metadata } from 'next';
import { LoginPageContent } from './LoginPageContent';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Timezone Harmony account.',
  robots: { index: false },
};

export default function Page() {
  return <LoginPageContent />;
}
