export interface TimezoneInfo {
  identifier: string;
  displayName: string;
  offset: string;
  offsetMinutes: number;
  country?: string;
  // City name per locale (key: locale code, value: localized city name).
  // e.g. { "ja": "東京" }. Only set when CLDR data is available for the locale.
  localizedCities?: Record<string, string>;
  // Katakana reading of localizedCities, for languages where written and phonetic forms differ.
  // e.g. { "ja": "トウキョウ" }. Pre-computed at startup via kuromoji.
  localizedCitiesReading?: Record<string, string>;
  // Country name per locale (key: locale code, value: localized country name).
  // e.g. { "ja": "日本" }. Resolved via Intl.DisplayNames.
  localizedCountry?: Record<string, string>;
  // Katakana reading of localizedCountry, for languages where written and phonetic forms differ.
  // e.g. { "ja": "ニホン ニッポン" }. Multiple readings are space-separated.
  localizedCountryReading?: Record<string, string>;
}

export interface CurrentTimeInfo {
  timezone: string;
  currentTime: string;
  offset: string;
}
