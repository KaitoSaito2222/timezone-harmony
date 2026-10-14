// Generates src/data/timezones.json: the localized names and readings for every
// IANA timezone. These never change between requests, so they are computed once
// here instead of at runtime. UTC offsets are left out on purpose: they change
// with DST and are computed in the browser (see src/services/timezone.service.ts).
//
// Run with `npm run generate:timezones` and commit the result.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const kuromoji = require('kuromoji');
const ct = require('countries-and-timezones');

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = resolve(ROOT, 'src/data/timezones.json');

// Add locale codes here to support additional languages.
// Each locale must have a corresponding file in cldr-dates-full/main/<locale>/timeZoneNames.json.
const SUPPORTED_LOCALES = ['ja', 'ko', 'zh', 'es', 'fr', 'hi', 'th'];

// Locales that require kuromoji readings (CJK languages where written form differs from phonetic form).
const KUROMOJI_LOCALES = ['ja'];

// Words with multiple valid readings that kuromoji cannot resolve on its own.
// Value is a space-separated list of all readings to include in search.
const ALTERNATE_READINGS = {
  ニッポン: 'ニッポン ニホン', // 日本: both "nippon" and "nihon" are valid
};

// Recursively flattens the nested CLDR zone structure into a flat map.
// e.g. { Asia: { Tokyo: { exemplarCity: "東京" } } } -> { "Asia/Tokyo": "東京" }
function flattenZones(obj, prefix) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === '_type' || typeof value !== 'object' || value === null) continue;
    const id = prefix ? `${prefix}/${key}` : key;
    if (typeof value.exemplarCity === 'string') result[id] = value.exemplarCity;
    Object.assign(result, flattenZones(value, id));
  }
  return result;
}

// locale -> (IANA identifier -> exemplar city name)
function loadCldrCities() {
  const result = new Map();
  for (const locale of SUPPORTED_LOCALES) {
    const filePath = require.resolve(`cldr-dates-full/main/${locale}/timeZoneNames.json`);
    const raw = JSON.parse(readFileSync(filePath, 'utf-8'));
    result.set(locale, flattenZones(raw.main[locale].dates.timeZoneNames.zone, ''));
  }
  return result;
}

function buildTokenizer() {
  const dicPath = resolve(dirname(require.resolve('kuromoji/package.json')), 'dict');
  return new Promise((res, rej) => {
    kuromoji.builder({ dicPath }).build((err, t) => (err ? rej(err) : res(t)));
  });
}

function localizedCountryNames(countryCode) {
  const names = {};
  for (const locale of SUPPORTED_LOCALES) {
    const name = new Intl.DisplayNames([locale], { type: 'region' }).of(countryCode);
    if (name) names[locale] = name;
  }
  return names;
}

// "America/New_York" → "New York"
function formatDisplayName(identifier) {
  const parts = identifier.split('/');
  return parts[parts.length - 1].replace(/_/g, ' ');
}

function nonEmpty(obj) {
  return Object.keys(obj).length > 0 ? obj : undefined;
}

async function main() {
  const cldrCities = loadCldrCities();
  const tokenizer = await buildTokenizer();

  const getReading = (text) =>
    tokenizer
      .tokenize(text)
      .map((t) => t.reading ?? t.surface_form)
      .join('');

  const zones = Intl.supportedValuesOf('timeZone');

  // Katakana readings for every city and country name in the kuromoji locales.
  const readings = new Map();
  for (const locale of KUROMOJI_LOCALES) {
    for (const city of Object.values(cldrCities.get(locale))) readings.set(city, getReading(city));
  }
  for (const zone of zones) {
    const countryCode = ct.getTimezone(zone)?.countries?.[0];
    if (!countryCode) continue;
    for (const locale of KUROMOJI_LOCALES) {
      const name = new Intl.DisplayNames([locale], { type: 'region' }).of(countryCode);
      if (name && !readings.has(name)) readings.set(name, getReading(name));
    }
  }

  // A name in any locale gets a reading when the same text has one (e.g. "香港" in zh).
  const buildReadingMap = (source) => {
    const result = {};
    for (const [locale, text] of Object.entries(source)) {
      const reading = readings.get(text);
      if (reading && reading !== text) result[locale] = ALTERNATE_READINGS[reading] ?? reading;
    }
    return result;
  };

  const timezones = zones.map((identifier) => {
    const countryCode = ct.getTimezone(identifier)?.countries?.[0];
    // Some timezones span multiple countries; use only the first one as a representative.
    const country = countryCode ? ct.getCountry(countryCode)?.name : undefined;

    const localizedCities = {};
    for (const [locale, cities] of cldrCities) {
      if (cities[identifier]) localizedCities[locale] = cities[identifier];
    }
    const localizedCountry = countryCode ? localizedCountryNames(countryCode) : {};

    return {
      identifier,
      displayName: formatDisplayName(identifier),
      country,
      localizedCities: nonEmpty(localizedCities),
      localizedCitiesReading: nonEmpty(buildReadingMap(localizedCities)),
      localizedCountry: nonEmpty(localizedCountry),
      localizedCountryReading: nonEmpty(buildReadingMap(localizedCountry)),
    };
  });

  mkdirSync(dirname(OUTPUT), { recursive: true });
  // One timezone per line keeps diffs of this file readable.
  writeFileSync(OUTPUT, `[\n${timezones.map((tz) => JSON.stringify(tz)).join(',\n')}\n]\n`);
  console.log(`Wrote ${timezones.length} timezones to ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
