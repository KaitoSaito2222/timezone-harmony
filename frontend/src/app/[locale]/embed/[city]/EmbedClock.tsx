'use client';

import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { getLocaleMeta } from '@/i18n/localeConfig';

interface Props {
  identifier: string;
  locale: string;
  cityName: string;
  offset: string;
  href: string;
  initial: { time: string; date: string };
}

export function EmbedClock({ identifier, locale, cityName, offset, href, initial }: Props) {
  const [clock, setClock] = useState(initial);
  const dateFormat = getLocaleMeta(locale).dateFormat;

  useEffect(() => {
    const tick = () => {
      const dt = DateTime.now().setZone(identifier).setLocale(locale);
      setClock({ time: dt.toFormat('HH:mm:ss'), date: dt.toFormat(dateFormat) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [identifier, locale, dateFormat]);

  return (
    <div className="flex h-screen flex-col justify-center rounded-xl border bg-card px-5 py-4">
      <p className="text-sm font-medium">{cityName}</p>
      <p className="text-5xl font-bold tabular-nums font-mono leading-tight">{clock.time}</p>
      <p className="text-xs text-muted-foreground tabular-nums">
        {clock.date} · {offset}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className="mt-2 text-xs text-primary hover:underline"
      >
        Timezone Harmony
      </a>
    </div>
  );
}
