export interface CityDef {
  slug: string;
  identifier: string; // IANA timezone
  name: string;
  country: string;
  localizations?: Partial<Record<string, { name: string; country: string }>>;
}

export const CITIES: CityDef[] = [
  { slug: 'tokyo',        identifier: 'Asia/Tokyo',          name: 'Tokyo',       country: 'Japan',        localizations: { ja: { name: '東京',             country: '日本'               }, ko: { name: '도쿄',        country: '일본'              } } },
  { slug: 'newyork',      identifier: 'America/New_York',    name: 'New York',    country: 'USA',          localizations: { ja: { name: 'ニューヨーク',     country: 'アメリカ'           }, ko: { name: '뉴욕',        country: '미국'              } } },
  { slug: 'losangeles',   identifier: 'America/Los_Angeles', name: 'Los Angeles', country: 'USA',          localizations: { ja: { name: 'ロサンゼルス',     country: 'アメリカ'           }, ko: { name: '로스앤젤레스', country: '미국'              } } },
  { slug: 'london',       identifier: 'Europe/London',       name: 'London',      country: 'UK',           localizations: { ja: { name: 'ロンドン',         country: 'イギリス'           }, ko: { name: '런던',        country: '영국'              } } },
  { slug: 'paris',        identifier: 'Europe/Paris',        name: 'Paris',       country: 'France',       localizations: { ja: { name: 'パリ',             country: 'フランス'           }, ko: { name: '파리',        country: '프랑스'            } } },
  { slug: 'berlin',       identifier: 'Europe/Berlin',       name: 'Berlin',      country: 'Germany',      localizations: { ja: { name: 'ベルリン',         country: 'ドイツ'             }, ko: { name: '베를린',      country: '독일'              } } },
  { slug: 'dubai',        identifier: 'Asia/Dubai',          name: 'Dubai',       country: 'UAE',          localizations: { ja: { name: 'ドバイ',           country: 'アラブ首長国連邦'   }, ko: { name: '두바이',      country: '아랍에미리트'      } } },
  { slug: 'singapore',    identifier: 'Asia/Singapore',      name: 'Singapore',   country: 'Singapore',    localizations: { ja: { name: 'シンガポール',     country: 'シンガポール'       }, ko: { name: '싱가포르',    country: '싱가포르'          } } },
  { slug: 'hongkong',     identifier: 'Asia/Hong_Kong',      name: 'Hong Kong',   country: 'China',        localizations: { ja: { name: '香港',             country: '中国'               }, ko: { name: '홍콩',        country: '중국'              } } },
  { slug: 'shanghai',     identifier: 'Asia/Shanghai',       name: 'Shanghai',    country: 'China',        localizations: { ja: { name: '上海',             country: '中国'               }, ko: { name: '상하이',      country: '중국'              } } },
  { slug: 'seoul',        identifier: 'Asia/Seoul',          name: 'Seoul',       country: 'South Korea',  localizations: { ja: { name: 'ソウル',           country: '韓国'               }, ko: { name: '서울',        country: '대한민국'          } } },
  { slug: 'sydney',       identifier: 'Australia/Sydney',    name: 'Sydney',      country: 'Australia',    localizations: { ja: { name: 'シドニー',         country: 'オーストラリア'     }, ko: { name: '시드니',      country: '호주'              } } },
  { slug: 'toronto',      identifier: 'America/Toronto',     name: 'Toronto',     country: 'Canada',       localizations: { ja: { name: 'トロント',         country: 'カナダ'             }, ko: { name: '토론토',      country: '캐나다'            } } },
  { slug: 'chicago',      identifier: 'America/Chicago',     name: 'Chicago',     country: 'USA',          localizations: { ja: { name: 'シカゴ',           country: 'アメリカ'           }, ko: { name: '시카고',      country: '미국'              } } },
  { slug: 'saopaulo',     identifier: 'America/Sao_Paulo',   name: 'São Paulo',   country: 'Brazil',       localizations: { ja: { name: 'サンパウロ',       country: 'ブラジル'           }, ko: { name: '상파울루',    country: '브라질'            } } },
  { slug: 'mumbai',       identifier: 'Asia/Kolkata',        name: 'Mumbai',      country: 'India',        localizations: { ja: { name: 'ムンバイ',         country: 'インド'             }, ko: { name: '뭄바이',      country: '인도'              } } },
  { slug: 'moscow',       identifier: 'Europe/Moscow',       name: 'Moscow',      country: 'Russia',       localizations: { ja: { name: 'モスクワ',         country: 'ロシア'             }, ko: { name: '모스크바',    country: '러시아'            } } },
  { slug: 'istanbul',     identifier: 'Europe/Istanbul',     name: 'Istanbul',    country: 'Turkey',       localizations: { ja: { name: 'イスタンブール',   country: 'トルコ'             }, ko: { name: '이스탄불',    country: '튀르키예'          } } },
  { slug: 'bangkok',      identifier: 'Asia/Bangkok',        name: 'Bangkok',     country: 'Thailand',     localizations: { ja: { name: 'バンコク',         country: 'タイ'               }, ko: { name: '방콕',        country: '태국'              } } },
  { slug: 'kualalumpur',  identifier: 'Asia/Kuala_Lumpur',   name: 'Kuala Lumpur',country: 'Malaysia',     localizations: { ja: { name: 'クアラルンプール', country: 'マレーシア'         }, ko: { name: '쿠알라룸푸르', country: '말레이시아'        } } },
  { slug: 'amsterdam',    identifier: 'Europe/Amsterdam',    name: 'Amsterdam',   country: 'Netherlands',  localizations: { ja: { name: 'アムステルダム',   country: 'オランダ'           }, ko: { name: '암스테르담',  country: '네덜란드'          } } },
  { slug: 'madrid',       identifier: 'Europe/Madrid',       name: 'Madrid',      country: 'Spain',        localizations: { ja: { name: 'マドリード',       country: 'スペイン'           }, ko: { name: '마드리드',    country: '스페인'            } } },
  { slug: 'johannesburg', identifier: 'Africa/Johannesburg', name: 'Johannesburg',country: 'South Africa', localizations: { ja: { name: 'ヨハネスブルク',   country: '南アフリカ'         }, ko: { name: '요하네스버그', country: '남아프리카 공화국' } } },
  { slug: 'cairo',        identifier: 'Africa/Cairo',        name: 'Cairo',       country: 'Egypt',        localizations: { ja: { name: 'カイロ',           country: 'エジプト'           }, ko: { name: '카이로',      country: '이집트'            } } },
  { slug: 'mexicocity',   identifier: 'America/Mexico_City', name: 'Mexico City', country: 'Mexico',       localizations: { ja: { name: 'メキシコシティ',   country: 'メキシコ'           }, ko: { name: '멕시코시티',  country: '멕시코'            } } },
  { slug: 'jakarta',      identifier: 'Asia/Jakarta',        name: 'Jakarta',     country: 'Indonesia',    localizations: { ja: { name: 'ジャカルタ',       country: 'インドネシア'       }, ko: { name: '자카르타',    country: '인도네시아'        } } },
  { slug: 'auckland',     identifier: 'Pacific/Auckland',    name: 'Auckland',    country: 'New Zealand',  localizations: { ja: { name: 'オークランド',     country: 'ニュージーランド'   }, ko: { name: '오클랜드',    country: '뉴질랜드'          } } },
  { slug: 'denver',       identifier: 'America/Denver',      name: 'Denver',      country: 'USA',          localizations: { ja: { name: 'デンバー',         country: 'アメリカ'           }, ko: { name: '덴버',        country: '미국'              } } },
  { slug: 'lagos',        identifier: 'Africa/Lagos',        name: 'Lagos',       country: 'Nigeria',      localizations: { ja: { name: 'ラゴス',           country: 'ナイジェリア'       }, ko: { name: '라고스',      country: '나이지리아'        } } },
  { slug: 'nairobi',      identifier: 'Africa/Nairobi',      name: 'Nairobi',     country: 'Kenya',        localizations: { ja: { name: 'ナイロビ',         country: 'ケニア'             }, ko: { name: '나이로비',    country: '케냐'              } } },
];

// Lookup map: slug → CityDef
export const CITY_MAP = new Map<string, CityDef>(CITIES.map(c => [c.slug, c]));

/** Returns a copy of CityDef with name/country localized for the given locale */
export function getCityLocalized(city: CityDef, locale: string): CityDef {
  const loc = city.localizations?.[locale];
  if (!loc) return city;
  return { ...city, name: loc.name, country: loc.country };
}

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

/** Returns all 435 two-city pair slugs in alphabetical order (canonical form) */
export function getAllPairSlugs(): string[] {
  const slugs = CITIES.map(c => c.slug).sort();
  const pairs: string[] = [];
  for (let i = 0; i < slugs.length; i++)
    for (let j = i + 1; j < slugs.length; j++)
      pairs.push(`${slugs[i]}-${slugs[j]}`);
  return pairs;
}

/** Slugs for popular cities used for pre-built 3-city triplets */
export const POPULAR_SLUGS = [
  'tokyo', 'newyork', 'london', 'paris', 'singapore',
  'sydney', 'dubai', 'seoul', 'shanghai', 'mumbai',
  'hongkong', 'bangkok', 'kualalumpur', 'jakarta',
] as const;

/** Returns the 120 popular 3-city triplet slugs (10C3, alphabetical order within each) */
export function getPopularTripletSlugs(): string[] {
  const sortedSlugs = [...POPULAR_SLUGS].sort();
  const triplets: string[] = [];
  for (let i = 0; i < sortedSlugs.length; i++)
    for (let j = i + 1; j < sortedSlugs.length; j++)
      for (let k = j + 1; k < sortedSlugs.length; k++)
        triplets.push(`${sortedSlugs[i]}-${sortedSlugs[j]}-${sortedSlugs[k]}`);
  return triplets;
}

/** Popular 2-city pairs for internal linking (hand-picked high-traffic combos) */
export const POPULAR_PAIRS: { slug: string }[] = [
  // North America ↔ Europe
  { slug: 'london-newyork' },
  { slug: 'london-toronto' },
  { slug: 'london-chicago' },
  { slug: 'newyork-paris' },
  { slug: 'berlin-newyork' },
  { slug: 'amsterdam-newyork' },
  // North America ↔ Asia/Pacific
  { slug: 'losangeles-newyork' },
  { slug: 'losangeles-tokyo' },
  { slug: 'newyork-tokyo' },
  { slug: 'chicago-tokyo' },
  { slug: 'newyork-sydney' },
  { slug: 'losangeles-sydney' },
  // Europe ↔ Asia
  { slug: 'london-tokyo' },
  { slug: 'london-singapore' },
  { slug: 'london-sydney' },
  { slug: 'london-paris' },
  { slug: 'berlin-tokyo' },
  { slug: 'paris-tokyo' },
  // Middle East
  { slug: 'dubai-london' },
  { slug: 'dubai-mumbai' },
  { slug: 'dubai-newyork' },
  { slug: 'dubai-singapore' },
  // Asia ↔ Asia
  { slug: 'singapore-tokyo' },
  { slug: 'seoul-tokyo' },
  { slug: 'hongkong-tokyo' },
  { slug: 'hongkong-london' },
  { slug: 'mumbai-london' },
  { slug: 'mumbai-newyork' },
  { slug: 'bangkok-london' },
  { slug: 'shanghai-tokyo' },
];
