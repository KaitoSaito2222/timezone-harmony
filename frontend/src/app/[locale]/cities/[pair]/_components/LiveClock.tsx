'use client';

import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

interface LiveClockProps {
  timezone: string; // IANA identifier
  cityName: string;
}

export function LiveClock({ timezone, cityName }: LiveClockProps) {
  const [time, setTime] = useState<string>('--:--:--');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const dt = DateTime.now().setZone(timezone);
      setTime(dt.toFormat('HH:mm:ss'));
      setDate(dt.toFormat('EEE, MMM d'));
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-muted-foreground mb-1">{cityName}</p>
      <p className="text-3xl font-mono font-semibold tabular-nums">{time}</p>
      <p className="text-sm text-muted-foreground mt-1">{date}</p>
    </div>
  );
}
