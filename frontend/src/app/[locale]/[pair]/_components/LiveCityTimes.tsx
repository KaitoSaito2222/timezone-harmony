'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { DateTime } from 'luxon';
import { getLocaleMeta } from '@/i18n/localeConfig';

interface CityTimeProps {
  name: string;
  identifier: string;
  offset: string;
}

interface CityState {
  time: string;
  date: string;
  ordinal: number; // day-of-year for cross-city date comparison
}

interface Props {
  cities: CityTimeProps[];
  initialStates: CityState[];
  diffLabel?: string;
  locale: string;
}

function getStates(cities: CityTimeProps[], locale: string): CityState[] {
  return cities.map(c => {
    const dt = DateTime.now().setZone(c.identifier).setLocale(locale);
    return {
      time: dt.toFormat('HH:mm'),
      date: dt.toFormat(getLocaleMeta(locale).dateFormat),
      ordinal: dt.ordinal,
    };
  });
}

export function LiveCityTimes({ cities, initialStates, diffLabel, locale }: Props) {
  const t = useTranslations('cityPair');
  const [states, setStates] = useState(initialStates);

  useEffect(() => {
    const update = () => setStates(getStates(cities, locale));
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [cities, locale]);

  const baseOrdinal = states[0]?.ordinal;

  return (
    <div className="mt-6 flex flex-wrap items-stretch gap-3">
      {cities.map((city, i) => {
        const dayDiff = states[i].ordinal - baseOrdinal;
        const isDifferentDay = dayDiff !== 0;
        return (
          <div
            key={city.identifier}
            className={`rounded-xl border px-5 py-3 shadow-sm transition-colors ${
              isDifferentDay ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800' : 'bg-card'
            }`}
          >
            <p className="text-4xl font-bold tabular-nums font-mono leading-none">{states[i].time}</p>
            <p className={`mt-1.5 text-sm tabular-nums ${isDifferentDay ? 'text-amber-700 dark:text-amber-400 font-medium' : 'text-muted-foreground'}`}>
              {states[i].date}
              {dayDiff > 0 && <span className="ml-1.5 text-xs font-semibold rounded-full bg-amber-200 dark:bg-amber-800 px-1.5 py-0.5">+{dayDiff}d</span>}
              {dayDiff < 0 && <span className="ml-1.5 text-xs font-semibold rounded-full bg-amber-200 dark:bg-amber-800 px-1.5 py-0.5">{dayDiff}d</span>}
            </p>
            <p className="mt-1 text-sm font-medium">{city.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{city.offset}</p>
          </div>
        );
      })}
      {diffLabel && (
        <div className="rounded-xl border bg-primary/5 px-5 py-3 shadow-sm flex flex-col justify-center">
          <p className="text-4xl font-bold tabular-nums text-primary leading-none">{diffLabel}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('timeDifference')}</p>
        </div>
      )}
    </div>
  );
}
