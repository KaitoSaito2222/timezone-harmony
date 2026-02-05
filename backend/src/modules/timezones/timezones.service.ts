import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import ct from 'countries-and-timezones';

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
  country?: string;
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

  private formatDisplayName(identifier: string): string {
    // "Asia/Tokyo" → "Tokyo"
    // "America/New_York" → "New York"
    const parts = identifier.split('/');
    const city = parts[parts.length - 1];
    return city.replace(/_/g, ' ');
  }

  private toTimezoneInfo(identifier: string): TimezoneInfo | null {
    try {
      const now = DateTime.now().setZone(identifier);
      if (!now.isValid) return null;

      const tzData = ct.getTimezone(identifier);
      const country = tzData?.countries?.[0]
        ? ct.getCountry(tzData.countries[0])?.name
        : undefined;

      return {
        identifier,
        displayName: this.formatDisplayName(identifier),
        offset: this.formatOffset(now.offset),
        offsetMinutes: now.offset,
        country,
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
}
