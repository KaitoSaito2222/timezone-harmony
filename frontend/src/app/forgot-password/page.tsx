import type { Metadata } from 'next';
import { ForgotPasswordPageContent } from './ForgotPasswordPageContent';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your Timezone Harmony account password.',
  robots: { index: false },
};

export default function Page() {
  return <ForgotPasswordPageContent />;
}
