export interface CityDef {
  slug: string;
  identifier: string; // IANA timezone
  name: string;
  country: string;
}

export const CITIES: CityDef[] = [
  { slug: 'tokyo',          identifier: 'Asia/Tokyo',           name: 'Tokyo',          country: 'Japan' },
  { slug: 'newyork',        identifier: 'America/New_York',     name: 'New York',        country: 'USA' },
  { slug: 'losangeles',     identifier: 'America/Los_Angeles',  name: 'Los Angeles',     country: 'USA' },
  { slug: 'london',         identifier: 'Europe/London',        name: 'London',          country: 'UK' },
  { slug: 'paris',          identifier: 'Europe/Paris',         name: 'Paris',           country: 'France' },
  { slug: 'berlin',         identifier: 'Europe/Berlin',        name: 'Berlin',          country: 'Germany' },
  { slug: 'dubai',          identifier: 'Asia/Dubai',           name: 'Dubai',           country: 'UAE' },
  { slug: 'singapore',      identifier: 'Asia/Singapore',       name: 'Singapore',       country: 'Singapore' },
  { slug: 'hongkong',       identifier: 'Asia/Hong_Kong',       name: 'Hong Kong',       country: 'China' },
  { slug: 'shanghai',       identifier: 'Asia/Shanghai',        name: 'Shanghai',        country: 'China' },
  { slug: 'seoul',          identifier: 'Asia/Seoul',           name: 'Seoul',           country: 'South Korea' },
  { slug: 'sydney',         identifier: 'Australia/Sydney',     name: 'Sydney',          country: 'Australia' },
  { slug: 'toronto',        identifier: 'America/Toronto',      name: 'Toronto',         country: 'Canada' },
  { slug: 'chicago',        identifier: 'America/Chicago',      name: 'Chicago',         country: 'USA' },
  { slug: 'saopaulo',       identifier: 'America/Sao_Paulo',    name: 'São Paulo',       country: 'Brazil' },
  { slug: 'mumbai',         identifier: 'Asia/Kolkata',         name: 'Mumbai',          country: 'India' },
  { slug: 'moscow',         identifier: 'Europe/Moscow',        name: 'Moscow',          country: 'Russia' },
  { slug: 'istanbul',       identifier: 'Europe/Istanbul',      name: 'Istanbul',        country: 'Turkey' },
  { slug: 'bangkok',        identifier: 'Asia/Bangkok',         name: 'Bangkok',         country: 'Thailand' },
  { slug: 'kualalumpur',    identifier: 'Asia/Kuala_Lumpur',    name: 'Kuala Lumpur',    country: 'Malaysia' },
  { slug: 'amsterdam',      identifier: 'Europe/Amsterdam',     name: 'Amsterdam',       country: 'Netherlands' },
  { slug: 'madrid',         identifier: 'Europe/Madrid',        name: 'Madrid',          country: 'Spain' },
  { slug: 'johannesburg',   identifier: 'Africa/Johannesburg',  name: 'Johannesburg',    country: 'South Africa' },
  { slug: 'cairo',          identifier: 'Africa/Cairo',         name: 'Cairo',           country: 'Egypt' },
  { slug: 'mexicocity',     identifier: 'America/Mexico_City',  name: 'Mexico City',     country: 'Mexico' },
  { slug: 'jakarta',        identifier: 'Asia/Jakarta',         name: 'Jakarta',         country: 'Indonesia' },
  { slug: 'auckland',       identifier: 'Pacific/Auckland',     name: 'Auckland',        country: 'New Zealand' },
  { slug: 'denver',         identifier: 'America/Denver',       name: 'Denver',          country: 'USA' },
  { slug: 'lagos',          identifier: 'Africa/Lagos',         name: 'Lagos',           country: 'Nigeria' },
  { slug: 'nairobi',        identifier: 'Africa/Nairobi',       name: 'Nairobi',         country: 'Kenya' },
];

// Lookup map: slug → CityDef
export const CITY_MAP = new Map<string, CityDef>(CITIES.map(c => [c.slug, c]));

/**
 * Parses a pair string ("tokyo-newyork" or "london-newyork-tokyo") into
 * an array of CityDef. Returns null if any slug is invalid.
 * Only 2 or 3 cities are accepted.
 */
export function parseCities(pair: string): CityDef[] | null {
  const slugs = pair.split('-');
  // Only 2 or 3 cities allowed
  if (slugs.length < 2 || slugs.length > 3) return null;

  const cities: CityDef[] = [];
  for (const slug of slugs) {
    const city = CITY_MAP.get(slug);
    if (!city) return null;
    cities.push(city);
  }
  return cities;
}

/** Returns all 435 two-city pair slugs in alphabetical order */
export function getAllPairSlugs(): string[] {
  const slugs = CITIES.map(c => c.slug);
  const pairs: string[] = [];
  for (let i = 0; i < slugs.length; i++)
    for (let j = i + 1; j < slugs.length; j++)
      pairs.push(`${slugs[i]}-${slugs[j]}`);
  return pairs;
}

/** Slugs for the top-10 popular cities used for pre-built 3-city triplets */
export const POPULAR_SLUGS = [
  'tokyo', 'newyork', 'london', 'paris', 'singapore',
  'sydney', 'dubai', 'seoul', 'shanghai', 'mumbai',
] as const;

/** Returns the 120 popular 3-city triplet slugs (10C3, alphabetical order within each) */
export function getPopularTripletSlugs(): string[] {
  const triplets: string[] = [];
  for (let i = 0; i < POPULAR_SLUGS.length; i++)
    for (let j = i + 1; j < POPULAR_SLUGS.length; j++)
      for (let k = j + 1; k < POPULAR_SLUGS.length; k++)
        triplets.push(`${POPULAR_SLUGS[i]}-${POPULAR_SLUGS[j]}-${POPULAR_SLUGS[k]}`);
  return triplets;
}

/** Popular 2-city pairs for internal linking (hand-picked high-traffic combos) */
export const POPULAR_PAIRS: { slug: string; label: string }[] = [
  { slug: 'london-newyork',    label: 'London ↔ New York' },
  { slug: 'london-tokyo',      label: 'London ↔ Tokyo' },
  { slug: 'newyork-tokyo',     label: 'New York ↔ Tokyo' },
  { slug: 'london-singapore',  label: 'London ↔ Singapore' },
  { slug: 'dubai-london',      label: 'Dubai ↔ London' },
  { slug: 'singapore-tokyo',   label: 'Singapore ↔ Tokyo' },
  { slug: 'newyork-paris',     label: 'New York ↔ Paris' },
  { slug: 'london-paris',      label: 'London ↔ Paris' },
  { slug: 'dubai-mumbai',      label: 'Dubai ↔ Mumbai' },
  { slug: 'seoul-tokyo',       label: 'Seoul ↔ Tokyo' },
  { slug: 'losangeles-newyork', label: 'Los Angeles ↔ New York' },
  { slug: 'london-sydney',     label: 'London ↔ Sydney' },
];
