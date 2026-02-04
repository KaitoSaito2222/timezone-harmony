import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

const POPULAR_TIMEZONES = [
  'Asia/Tokyo',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Asia/Dubai',
  'America/Chicago',
];

export interface TimezoneInfo {
  identifier: string;
  displayName: string;
  offset: string;
  offsetMinutes: number;
}

@Injectable()
export class TimezonesService {
  private formatOffset(minutes: number): string {
    const sign = minutes >= 0 ? '+' : '-';
    const absMinutes = Math.abs(minutes);
    const hours = Math.floor(absMinutes / 60);
    const mins = absMinutes % 60;
    return `${sign}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  private toTimezoneInfo(identifier: string): TimezoneInfo | null {
    try {
      const now = DateTime.now().setZone(identifier);
      if (!now.isValid) return null;

      return {
        identifier,
        displayName: now.offsetNameLong || identifier,
        offset: this.formatOffset(now.offset),
        offsetMinutes: now.offset,
      };
    } catch {
      return null;
    }
  }

  getAllTimezones(): TimezoneInfo[] {
    // Intl APIから全タイムゾーンを取得
    const allZones = Intl.supportedValuesOf('timeZone');
    return allZones
      .map((tz) => this.toTimezoneInfo(tz))
      .filter((tz): tz is TimezoneInfo => tz !== null)
      .sort((a, b) => a.offsetMinutes - b.offsetMinutes);
  }

  getPopularTimezones(): TimezoneInfo[] {
    return POPULAR_TIMEZONES.map((tz) => this.toTimezoneInfo(tz))
      .filter((tz): tz is TimezoneInfo => tz !== null)
      .sort((a, b) => a.offsetMinutes - b.offsetMinutes);
  }

  searchTimezones(query: string): TimezoneInfo[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllTimezones().filter(
      (tz) =>
        tz.identifier.toLowerCase().includes(lowerQuery) ||
        tz.displayName.toLowerCase().includes(lowerQuery),
    );
  }

  getTimezoneInfo(identifier: string): TimezoneInfo | null {
    return this.toTimezoneInfo(identifier);
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
