import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PresetsPageContent } from './PresetsPageContent';

export const metadata: Metadata = {
  title: 'My Presets',
  description: 'Manage your saved timezone presets.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute>
      <PresetsPageContent />
    </ProtectedRoute>
  );
}
