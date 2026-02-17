import type { Metadata } from 'next';
import { ResetPasswordContent } from './ResetPasswordContent';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your Timezone Harmony account.',
  robots: { index: false },
};

export default function Page() {
  return <ResetPasswordContent />;
}
