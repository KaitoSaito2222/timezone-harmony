import { useEffect, useState, useCallback } from 'react';
import { DateTime } from 'luxon';
import { isInBusinessHours } from '@/lib/timeline';
import type { OptimalTime } from '@/lib/timeline';
export function useOptimalMeetingTimes(
  timezones: string[],
  selectedDateTime: string,
  baseTimezone: string,
) {
  const [optimalTimes, setOptimalTimes] = useState<OptimalTime[]>([]);

  const findOptimalMeetingTimes = useCallback(() => {
    if (timezones.length === 0) return;
    const parsedDT =
      baseTimezone === 'local'
        ? DateTime.fromISO(selectedDateTime)
        : DateTime.fromISO(selectedDateTime, { zone: baseTimezone });
    const baseTime = parsedDT.startOf('day');
    const optimal: OptimalTime[] = [];

    for (let hour = 0; hour < 24; hour++) {
      let allInBusinessHours = true;
      const timesByZone: { timezone: string; time: string; hour: number }[] = [];

      timezones.forEach((timezone) => {
        const time = baseTime.setZone(timezone).plus({ hours: hour });
        timesByZone.push({
          timezone,
          time: time.toFormat('HH:mm'),
          hour: time.hour,
        });
        if (!isInBusinessHours(time.hour, null, null)) {
          allInBusinessHours = false;
        }
      });

      if (allInBusinessHours) optimal.push({ hour, times: timesByZone });
    }
    setOptimalTimes(optimal);
  }, [timezones, selectedDateTime, baseTimezone]);

  useEffect(() => {
    findOptimalMeetingTimes();
  }, [findOptimalMeetingTimes]);

  return optimalTimes;
}
