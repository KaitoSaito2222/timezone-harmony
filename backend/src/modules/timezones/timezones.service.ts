import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { getAllTimezones, Timezone } from 'countries-and-timezones';

export interface TimezoneInfo {
  identifier: string;
  displayName: string;
  offset: string;
  offsetMinutes: number;
  countries: string[];
}

@Injectable()
export class TimezonesService {
  private popularTimezones = [
    'Asia/Tokyo',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Singapore',
    'Australia/Sydney',
    'Asia/Shanghai',
    'Asia/Hong_Kong',
    'America/Chicago',
    'Europe/Berlin',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Pacific/Auckland',
    'America/Toronto',
  ];

  getAllTimezones(): TimezoneInfo[] {
    const timezones = getAllTimezones();
    return Object.values(timezones)
      .map((tz: Timezone) => ({
        identifier: tz.name,
        displayName: tz.name.replace(/_/g, ' '),
        offset: tz.utcOffsetStr,
        offsetMinutes: tz.utcOffset,
        countries: tz.countries || [],
      }))
      .sort((a, b) => a.offsetMinutes - b.offsetMinutes);
  }

  getPopularTimezones(): TimezoneInfo[] {
    const allTimezones = this.getAllTimezones();
    return allTimezones.filter((tz) =>
      this.popularTimezones.includes(tz.identifier),
    );
  }

  searchTimezones(query: string): TimezoneInfo[] {
    const allTimezones = this.getAllTimezones();
    const lowercaseQuery = query.toLowerCase();
    return allTimezones.filter(
      (tz) =>
        tz.identifier.toLowerCase().includes(lowercaseQuery) ||
        tz.displayName.toLowerCase().includes(lowercaseQuery),
    );
  }

  getTimezoneInfo(identifier: string): TimezoneInfo | null {
    const timezones = getAllTimezones();
    const tz = timezones[identifier];
    if (!tz) return null;

    return {
      identifier: tz.name,
      displayName: tz.name.replace(/_/g, ' '),
      offset: tz.utcOffsetStr,
      offsetMinutes: tz.utcOffset,
      countries: tz.countries || [],
    };
  }

  convertTime(
    isoTime: string,
    fromZone: string,
    toZone: string,
  ): string | null {
    try {
      return DateTime.fromISO(isoTime, { zone: fromZone })
        .setZone(toZone)
        .toISO();
    } catch {
      return null;
    }
  }

  getCurrentTime(timezone: string): {
    iso: string;
    formatted: string;
    offset: string;
  } | null {
    try {
      const now = DateTime.now().setZone(timezone);
      return {
        iso: now.toISO() || '',
        formatted: now.toFormat('yyyy-MM-dd HH:mm:ss'),
        offset: now.offsetNameShort || '',
      };
    } catch {
      return null;
    }
  }

  getMultipleTimezonesTimes(timezones: string[]): {
    timezone: string;
    currentTime: string;
    offset: string;
  }[] {
    return timezones
      .map((tz) => {
        const time = this.getCurrentTime(tz);
        if (!time) return null;
        return {
          timezone: tz,
          currentTime: time.formatted,
          offset: time.offset,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }
}
