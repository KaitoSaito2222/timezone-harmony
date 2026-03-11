import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import ct from 'countries-and-timezones';
import { TimezoneInfo } from './dto/timezone-info.dto';

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

@Injectable()
export class TimezonesService {
  // Converts a UTC offset in minutes to a formatted string (e.g. 540 → "+09:00", -300 → "-05:00").
  private formatOffset(minutes: number): string {
    const sign = minutes >= 0 ? '+' : '-';
    const absMinutes = Math.abs(minutes);
    const hours = Math.floor(absMinutes / 60);
    const mins = absMinutes % 60;
    return `${sign}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  // Extracts the city name from an IANA timezone identifier.
  // IANA (Internet Assigned Numbers Authority) defines the standard timezone database used by all major OSes and languages.
  // Its identifiers follow the "Region/City" format and use underscores instead of spaces (e.g. "America/New_York").
  private formatDisplayName(identifier: string): string {
    // "Asia/Tokyo" → "Tokyo"
    // "America/New_York" → "New York"
    const parts = identifier.split('/');
    const city = parts[parts.length - 1];
    return city.replace(/_/g, ' ');
  }

  // offset is calculated at call time so DST (Daylight Saving Time) changes are reflected correctly.
  private toTimezoneInfo(identifier: string): TimezoneInfo | null {
    try {
      const now = DateTime.now().setZone(identifier);
      if (!now.isValid) return null;

      const tzData = ct.getTimezone(identifier);
      // Some timezones span multiple countries; use only the first one as a representative.
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
    // Retrieve all supported timezone identifiers from the built-in Intl API.
    // IntlAPI is included as standard in Node.js.
    const allZones = Intl.supportedValuesOf('timeZone');
    return allZones
      .map((tz) => this.toTimezoneInfo(tz))
      .filter((tz): tz is TimezoneInfo => tz !== null)
      .sort((a, b) => a.offsetMinutes - b.offsetMinutes); // Sorted west to east (e.g. -12:00 → +14:00)
  }

  getPopularTimezones(): TimezoneInfo[] {
    return POPULAR_TIMEZONES.map((tz) => this.toTimezoneInfo(tz))
      .filter((tz): tz is TimezoneInfo => tz !== null)
      .sort((a, b) => a.offsetMinutes - b.offsetMinutes); // Sorted west to east (e.g. -12:00 → +14:00)
  }
}
