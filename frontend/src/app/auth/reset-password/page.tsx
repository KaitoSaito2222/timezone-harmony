import type { Metadata } from 'next';
import { ResetPasswordContent } from './ResetPasswordContent';

export const metadata: Metadata = {
  title: 'Reset Password',
  robots: { index: false },
};

export default function Page() {
  return <ResetPasswordContent />;
}
