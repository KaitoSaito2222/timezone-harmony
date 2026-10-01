'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DateTime } from 'luxon';
import { getLocaleMeta } from '@/i18n/localeConfig';
import { formatHourDiff } from '@/lib/dst';

interface Props {
  identifier: string;
  locale: string;
  initial: { time: string; date: string };
}

export function CityClock({ identifier, locale, initial }: Props) {
  const t = useTranslations('cityTime');
  const [clock, setClock] = useState(initial);
  const [diffHours, setDiffHours] = useState<number | null>(null);
  const dateFormat = getLocaleMeta(locale).dateFormat;

  useEffect(() => {
    const tick = () => {
      const dt = DateTime.now().setZone(identifier).setLocale(locale);
      setClock({ time: dt.toFormat('HH:mm:ss'), date: dt.toFormat(dateFormat) });
      const local = DateTime.now();
      setDiffHours((dt.offset - local.offset) / 60);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [identifier, locale, dateFormat]);

  let diffLabel: string | null = null;
  if (diffHours !== null) {
    if (diffHours === 0) diffLabel = t('youSame');
    else if (diffHours > 0) diffLabel = t('youAhead', { h: formatHourDiff(diffHours) });
    else diffLabel = t('youBehind', { h: formatHourDiff(Math.abs(diffHours)) });
  }

  return (
    <div className="mt-6 rounded-2xl border bg-card px-6 py-6 shadow-sm">
      <p className="text-6xl md:text-7xl font-bold tabular-nums font-mono leading-none" aria-live="off">
        {clock.time}
      </p>
      <p className="mt-3 text-base text-muted-foreground tabular-nums">{clock.date}</p>
      {diffLabel && (
        <p className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {diffLabel}
        </p>
      )}
    </div>
  );
}
