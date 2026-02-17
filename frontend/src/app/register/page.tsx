import type { Metadata } from 'next';
import { RegisterPageContent } from './RegisterPageContent';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new Timezone Harmony account.',
  robots: { index: false },
};

export default function Page() {
  return <RegisterPageContent />;
}
