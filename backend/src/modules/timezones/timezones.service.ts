import { Injectable, OnModuleInit } from '@nestjs/common';
import { DateTime } from 'luxon';
import ct from 'countries-and-timezones';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as kuromoji from 'kuromoji';
import { TimezoneInfo } from './dto/timezone-info.dto';

// Add locale codes here to support additional languages.
// Each locale must have a corresponding file in cldr-dates-full/main/<locale>/timeZoneNames.json.
const SUPPORTED_LOCALES = ['ja', 'ko', 'zh', 'es', 'fr', 'hi', 'th'];

interface TimeZoneNamesJson {
  main: Record<
    string,
    { dates: { timeZoneNames: { zone: Record<string, unknown> } } }
  >;
}

// Locales that require kuromoji readings (CJK languages where written form differs from phonetic form).
const KUROMOJI_LOCALES = ['ja'];

// Words with multiple valid readings that kuromoji cannot resolve on its own.
// Value is a space-separated list of all readings to include in search.
const ALTERNATE_READINGS: Record<string, string> = {
  ニッポン: 'ニッポン ニホン', // 日本: both "nippon" and "nihon" are valid
};

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
export class TimezonesService implements OnModuleInit {
  // Map: locale -> (IANA identifier -> exemplar city name)
  // e.g. "ja" -> { "Asia/Tokyo": "東京", "America/New_York": "ニューヨーク" }
  private readonly cldrCities: Map<string, Record<string, string>>;

  // Map: locale -> (text -> katakana reading)
  // Pre-computed at startup to avoid per-request kuromoji calls.
  private kuromojiReadings: Map<string, string> = new Map();

  constructor() {
    this.cldrCities = this.loadCldrCities();
  }

  async onModuleInit() {
    await this.loadKuromojiReadings();
  }

  private loadCldrCities(): Map<string, Record<string, string>> {
    const result = new Map<string, Record<string, string>>();
    for (const locale of SUPPORTED_LOCALES) {
      try {
        const filePath = resolve(
          process.cwd(),
          `node_modules/cldr-dates-full/main/${locale}/timeZoneNames.json`,
        );
        const raw = JSON.parse(
          readFileSync(filePath, 'utf-8'),
        ) as TimeZoneNamesJson;
        const zones = raw.main[locale].dates.timeZoneNames.zone;
        result.set(locale, this.flattenZones(zones, ''));
      } catch {
        // Skip locale if CLDR data is unavailable
      }
    }
    return result;
  }

  // Builds a kuromoji tokenizer and pre-computes katakana readings for all
  // Japanese city and country names. Runs once at startup.
  private async loadKuromojiReadings(): Promise<void> {
    const hasKuromojiLocale = SUPPORTED_LOCALES.some((l) =>
      KUROMOJI_LOCALES.includes(l),
    );
    if (!hasKuromojiLocale) return;

    const tokenizer = await new Promise<
      kuromoji.Tokenizer<kuromoji.IpadicFeatures>
    >((res, rej) => {
      kuromoji
        .builder({
          dicPath: resolve(process.cwd(), 'node_modules/kuromoji/dict'),
        })
        .build((err, t) => (err ? rej(err) : res(t)));
    });

    const getReading = (text: string): string =>
      tokenizer
        .tokenize(text)
        .map((t) => t.reading ?? t.surface_form)
        .join('');

    // Collect all unique Japanese texts (city names + country names) to convert.
    const textsToConvert = new Set<string>();

    for (const locale of KUROMOJI_LOCALES) {
      const cities = this.cldrCities.get(locale);
      if (cities) Object.values(cities).forEach((v) => textsToConvert.add(v));
    }

    // Country names via Intl.DisplayNames
    const allZones = Intl.supportedValuesOf('timeZone');
    for (const zone of allZones) {
      const tzData = ct.getTimezone(zone);
      const countryCode = tzData?.countries?.[0];
      if (!countryCode) continue;
      for (const locale of KUROMOJI_LOCALES) {
        try {
          const name = new Intl.DisplayNames([locale], { type: 'region' }).of(
            countryCode,
          );
          if (name) textsToConvert.add(name);
        } catch {
          // skip
        }
      }
    }

    for (const text of textsToConvert) {
      try {
        this.kuromojiReadings.set(text, getReading(text));
      } catch {
        // skip if tokenization fails
      }
    }
  }

  // Recursively flattens the nested CLDR zone structure into a flat map.
  // e.g. { Asia: { Tokyo: { exemplarCity: "東京" } } } -> { "Asia/Tokyo": "東京" }
  private flattenZones(
    obj: Record<string, unknown>,
    prefix: string,
  ): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === '_type' || typeof value !== 'object' || value === null)
        continue;
      const id = prefix ? `${prefix}/${key}` : key;
      const val = value as Record<string, unknown>;
      if (typeof val.exemplarCity === 'string') {
        result[id] = val.exemplarCity;
      }
      Object.assign(result, this.flattenZones(val, id));
    }
    return result;
  }

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

  private buildReadingMap(
    source: Record<string, string>,
  ): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [locale, text] of Object.entries(source)) {
      const reading = this.kuromojiReadings.get(text);
      if (reading && reading !== text) {
        result[locale] = ALTERNATE_READINGS[reading] ?? reading;
      }
    }
    return result;
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

      const localizedCities: Record<string, string> = {};
      for (const [locale, cities] of this.cldrCities) {
        if (cities[identifier]) localizedCities[locale] = cities[identifier];
      }

      const countryCode = tzData?.countries?.[0];
      const localizedCountry: Record<string, string> = {};
      if (countryCode) {
        for (const locale of SUPPORTED_LOCALES) {
          try {
            const name = new Intl.DisplayNames([locale], { type: 'region' }).of(
              countryCode,
            );
            if (name) localizedCountry[locale] = name;
          } catch {
            // Skip if locale is not supported by Intl.DisplayNames
          }
        }
      }

      const localizedCitiesReading = this.buildReadingMap(localizedCities);
      const localizedCountryReading = this.buildReadingMap(localizedCountry);

      return {
        identifier,
        displayName: this.formatDisplayName(identifier),
        offset: this.formatOffset(now.offset),
        offsetMinutes: now.offset,
        country,
        localizedCities:
          Object.keys(localizedCities).length > 0 ? localizedCities : undefined,
        localizedCitiesReading:
          Object.keys(localizedCitiesReading).length > 0
            ? localizedCitiesReading
            : undefined,
        localizedCountry:
          Object.keys(localizedCountry).length > 0
            ? localizedCountry
            : undefined,
        localizedCountryReading:
          Object.keys(localizedCountryReading).length > 0
            ? localizedCountryReading
            : undefined,
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
