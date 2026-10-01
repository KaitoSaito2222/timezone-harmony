import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { MyPolls } from './MyPolls';
import { PollCreateForm } from './PollCreateForm';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function NewPollPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-2xl">
      <MyPolls />
      <PollCreateForm />
    </div>
  );
}
