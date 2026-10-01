import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PollView } from './PollView';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PollPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <PollView id={id} />;
}
