export interface CityDef {
  slug: string;
  identifier: string; // IANA timezone
  name: string;
  country: string;
  localizations?: Partial<Record<string, { name: string; country: string }>>;
}

export const CITIES: CityDef[] = [
  { slug: 'tokyo',        identifier: 'Asia/Tokyo',          name: 'Tokyo',       country: 'Japan',        localizations: { ja: { name: '東京',             country: '日本'               }, ko: { name: '도쿄',        country: '일본'              }, zh: { name: '东京',          country: '日本'         }, es: { name: 'Tokio',           country: 'Japón'           }, fr: { name: 'Tokyo',           country: 'Japon'           }, hi: { name: 'टोक्यो',          country: 'जापान'       }, th: { name: 'โตเกียว',         country: 'ญี่ปุ่น'     } } },
  { slug: 'newyork',      identifier: 'America/New_York',    name: 'New York',    country: 'USA',          localizations: { ja: { name: 'ニューヨーク',     country: 'アメリカ'           }, ko: { name: '뉴욕',        country: '미국'              }, zh: { name: '纽约',          country: '美国'         }, es: { name: 'Nueva York',      country: 'EE. UU.'         }, fr: { name: 'New York',        country: 'États-Unis'      }, hi: { name: 'न्यूयॉर्क',       country: 'अमेरिका'     }, th: { name: 'นิวยอร์ก',        country: 'สหรัฐอเมริกา' } } },
  { slug: 'losangeles',   identifier: 'America/Los_Angeles', name: 'Los Angeles', country: 'USA',          localizations: { ja: { name: 'ロサンゼルス',     country: 'アメリカ'           }, ko: { name: '로스앤젤레스', country: '미국'              }, zh: { name: '洛杉矶',        country: '美国'         }, es: { name: 'Los Ángeles',     country: 'EE. UU.'         }, fr: { name: 'Los Angeles',     country: 'États-Unis'      }, hi: { name: 'लॉस एंजेलस',     country: 'अमेरिका'     }, th: { name: 'ลอสแอนเจลิส',     country: 'สหรัฐอเมริกา' } } },
  { slug: 'london',       identifier: 'Europe/London',       name: 'London',      country: 'UK',           localizations: { ja: { name: 'ロンドン',         country: 'イギリス'           }, ko: { name: '런던',        country: '영국'              }, zh: { name: '伦敦',          country: '英国'         }, es: { name: 'Londres',         country: 'Reino Unido'     }, fr: { name: 'Londres',         country: 'Royaume-Uni'     }, hi: { name: 'लंदन',            country: 'यूके'        }, th: { name: 'ลอนดอน',          country: 'สหราชอาณาจักร' } } },
  { slug: 'paris',        identifier: 'Europe/Paris',        name: 'Paris',       country: 'France',       localizations: { ja: { name: 'パリ',             country: 'フランス'           }, ko: { name: '파리',        country: '프랑스'            }, zh: { name: '巴黎',          country: '法国'         }, es: { name: 'París',           country: 'Francia'         }, fr: { name: 'Paris',           country: 'France'          }, hi: { name: 'पेरिस',           country: 'फ्रांस'      }, th: { name: 'ปารีส',            country: 'ฝรั่งเศส'    } } },
  { slug: 'berlin',       identifier: 'Europe/Berlin',       name: 'Berlin',      country: 'Germany',      localizations: { ja: { name: 'ベルリン',         country: 'ドイツ'             }, ko: { name: '베를린',      country: '독일'              }, zh: { name: '柏林',          country: '德国'         }, es: { name: 'Berlín',          country: 'Alemania'        }, fr: { name: 'Berlin',          country: 'Allemagne'       }, hi: { name: 'बर्लिन',          country: 'जर्मनी'      }, th: { name: 'เบอร์ลิน',         country: 'เยอรมนี'     } } },
  { slug: 'dubai',        identifier: 'Asia/Dubai',          name: 'Dubai',       country: 'UAE',          localizations: { ja: { name: 'ドバイ',           country: 'アラブ首長国連邦'   }, ko: { name: '두바이',      country: '아랍에미리트'      }, zh: { name: '迪拜',          country: '阿联酋'       }, es: { name: 'Dubái',           country: 'Emiratos Árabes' }, fr: { name: 'Dubaï',           country: 'Émirats arabes'  }, hi: { name: 'दुबई',            country: 'UAE'         }, th: { name: 'ดูไบ',             country: 'สหรัฐอาหรับเอมิเรตส์' } } },
  { slug: 'singapore',    identifier: 'Asia/Singapore',      name: 'Singapore',   country: 'Singapore',    localizations: { ja: { name: 'シンガポール',     country: 'シンガポール'       }, ko: { name: '싱가포르',    country: '싱가포르'          }, zh: { name: '新加坡',        country: '新加坡'       }, es: { name: 'Singapur',        country: 'Singapur'        }, fr: { name: 'Singapour',       country: 'Singapour'       }, hi: { name: 'सिंगापुर',        country: 'सिंगापुर'    }, th: { name: 'สิงคโปร์',         country: 'สิงคโปร์'    } } },
  { slug: 'hongkong',     identifier: 'Asia/Hong_Kong',      name: 'Hong Kong',   country: 'China',        localizations: { ja: { name: '香港',             country: '中国'               }, ko: { name: '홍콩',        country: '중국'              }, zh: { name: '香港',          country: '中国'         }, es: { name: 'Hong Kong',       country: 'China'           }, fr: { name: 'Hong Kong',       country: 'Chine'           }, hi: { name: 'हांगकांग',        country: 'चीन'         }, th: { name: 'ฮ่องกง',           country: 'จีน'         } } },
  { slug: 'shanghai',     identifier: 'Asia/Shanghai',       name: 'Shanghai',    country: 'China',        localizations: { ja: { name: '上海',             country: '中国'               }, ko: { name: '상하이',      country: '중국'              }, zh: { name: '上海',          country: '中国'         }, es: { name: 'Shanghái',        country: 'China'           }, fr: { name: 'Shanghai',        country: 'Chine'           }, hi: { name: 'शंघाई',           country: 'चีน'         }, th: { name: 'เซี่ยงไฮ้',        country: 'จีน'         } } },
  { slug: 'seoul',        identifier: 'Asia/Seoul',          name: 'Seoul',       country: 'South Korea',  localizations: { ja: { name: 'ソウル',           country: '韓国'               }, ko: { name: '서울',        country: '대한민국'          }, zh: { name: '首尔',          country: '韩国'         }, es: { name: 'Seúl',            country: 'Corea del Sur'   }, fr: { name: 'Séoul',           country: 'Corée du Sud'    }, hi: { name: 'सियोल',           country: 'दक्षिण कोरिया' }, th: { name: 'โซล',              country: 'เกาหลีใต้'   } } },
  { slug: 'sydney',       identifier: 'Australia/Sydney',    name: 'Sydney',      country: 'Australia',    localizations: { ja: { name: 'シドニー',         country: 'オーストラリア'     }, ko: { name: '시드니',      country: '호주'              }, zh: { name: '悉尼',          country: '澳大利亚'     }, es: { name: 'Sídney',          country: 'Australia'       }, fr: { name: 'Sydney',          country: 'Australie'       }, hi: { name: 'सिडनी',           country: 'ऑस्ट्रेलिया' }, th: { name: 'ซิดนีย์',          country: 'ออสเตรเลีย'  } } },
  { slug: 'toronto',      identifier: 'America/Toronto',     name: 'Toronto',     country: 'Canada',       localizations: { ja: { name: 'トロント',         country: 'カナダ'             }, ko: { name: '토론토',      country: '캐나다'            }, zh: { name: '多伦多',        country: '加拿大'       }, es: { name: 'Toronto',         country: 'Canadá'          }, fr: { name: 'Toronto',         country: 'Canada'          }, hi: { name: 'टोरंटो',          country: 'कनाडा'       }, th: { name: 'โตรอนโต',          country: 'แคนาดา'      } } },
  { slug: 'chicago',      identifier: 'America/Chicago',     name: 'Chicago',     country: 'USA',          localizations: { ja: { name: 'シカゴ',           country: 'アメリカ'           }, ko: { name: '시카고',      country: '미국'              }, zh: { name: '芝加哥',        country: '美国'         }, es: { name: 'Chicago',         country: 'EE. UU.'         }, fr: { name: 'Chicago',         country: 'États-Unis'      }, hi: { name: 'शिकागो',          country: 'अमेरिका'     }, th: { name: 'ชิคาโก',           country: 'สหรัฐอเมริกา' } } },
  { slug: 'saopaulo',     identifier: 'America/Sao_Paulo',   name: 'São Paulo',   country: 'Brazil',       localizations: { ja: { name: 'サンパウロ',       country: 'ブラジル'           }, ko: { name: '상파울루',    country: '브라질'            }, zh: { name: '圣保罗',        country: '巴西'         }, es: { name: 'São Paulo',        country: 'Brasil'          }, fr: { name: 'São Paulo',        country: 'Brésil'          }, hi: { name: 'साओ पाउलो',       country: 'ब्राज़ील'    }, th: { name: 'เซาเปาลู',         country: 'บราซิล'      } } },
  { slug: 'mumbai',       identifier: 'Asia/Kolkata',        name: 'Mumbai',      country: 'India',        localizations: { ja: { name: 'ムンバイ',         country: 'インド'             }, ko: { name: '뭄바이',      country: '인도'              }, zh: { name: '孟买',          country: '印度'         }, es: { name: 'Bombay',          country: 'India'           }, fr: { name: 'Mumbai',          country: 'Inde'            }, hi: { name: 'मुंबई',            country: 'भारत'        }, th: { name: 'มุมไบ',            country: 'อินเดีย'     } } },
  { slug: 'moscow',       identifier: 'Europe/Moscow',       name: 'Moscow',      country: 'Russia',       localizations: { ja: { name: 'モスクワ',         country: 'ロシア'             }, ko: { name: '모스크바',    country: '러시아'            }, zh: { name: '莫斯科',        country: '俄罗斯'       }, es: { name: 'Moscú',           country: 'Rusia'           }, fr: { name: 'Moscou',          country: 'Russie'          }, hi: { name: 'मॉस्को',          country: 'रूस'         }, th: { name: 'มอสโก',            country: 'รัสเซีย'     } } },
  { slug: 'istanbul',     identifier: 'Europe/Istanbul',     name: 'Istanbul',    country: 'Turkey',       localizations: { ja: { name: 'イスタンブール',   country: 'トルコ'             }, ko: { name: '이스탄불',    country: '튀르키예'          }, zh: { name: '伊斯坦布尔',    country: '土耳其'       }, es: { name: 'Estambul',        country: 'Turquía'         }, fr: { name: 'Istanbul',        country: 'Turquie'         }, hi: { name: 'इस्तांबुल',       country: 'तुर्की'      }, th: { name: 'อิสตันบูล',        country: 'ตุรกี'       } } },
  { slug: 'bangkok',      identifier: 'Asia/Bangkok',        name: 'Bangkok',     country: 'Thailand',     localizations: { ja: { name: 'バンコク',         country: 'タイ'               }, ko: { name: '방콕',        country: '태국'              }, zh: { name: '曼谷',          country: '泰国'         }, es: { name: 'Bangkok',         country: 'Tailandia'       }, fr: { name: 'Bangkok',         country: 'Thaïlande'       }, hi: { name: 'बैंकॉक',          country: 'थाईलैंड'     }, th: { name: 'กรุงเทพมหานคร',    country: 'ไทย'         } } },
  { slug: 'kualalumpur',  identifier: 'Asia/Kuala_Lumpur',   name: 'Kuala Lumpur',country: 'Malaysia',     localizations: { ja: { name: 'クアラルンプール', country: 'マレーシア'         }, ko: { name: '쿠알라룸푸르', country: '말레이시아'        }, zh: { name: '吉隆坡',        country: '马来西亚'     }, es: { name: 'Kuala Lumpur',    country: 'Malasia'         }, fr: { name: 'Kuala Lumpur',    country: 'Malaisie'        }, hi: { name: 'कुआलालंपुर',      country: 'मलेशिया'     }, th: { name: 'กัวลาลัมเปอร์',    country: 'มาเลเซีย'    } } },
  { slug: 'amsterdam',    identifier: 'Europe/Amsterdam',    name: 'Amsterdam',   country: 'Netherlands',  localizations: { ja: { name: 'アムステルダム',   country: 'オランダ'           }, ko: { name: '암스테르담',  country: '네덜란드'          }, zh: { name: '阿姆斯特丹',    country: '荷兰'         }, es: { name: 'Ámsterdam',       country: 'Países Bajos'    }, fr: { name: 'Amsterdam',       country: 'Pays-Bas'        }, hi: { name: 'एम्स्टर्डम',      country: 'नीदरलैंड'    }, th: { name: 'อัมสเตอร์ดัม',     country: 'เนเธอร์แลนด์' } } },
  { slug: 'madrid',       identifier: 'Europe/Madrid',       name: 'Madrid',      country: 'Spain',        localizations: { ja: { name: 'マドリード',       country: 'スペイン'           }, ko: { name: '마드리드',    country: '스페인'            }, zh: { name: '马德里',        country: '西班牙'       }, es: { name: 'Madrid',          country: 'España'          }, fr: { name: 'Madrid',          country: 'Espagne'         }, hi: { name: 'मैड्रिड',         country: 'स्पेन'       }, th: { name: 'มาดริด',           country: 'สเปน'        } } },
  { slug: 'johannesburg', identifier: 'Africa/Johannesburg', name: 'Johannesburg',country: 'South Africa', localizations: { ja: { name: 'ヨハネスブルク',   country: '南アフリカ'         }, ko: { name: '요하네스버그', country: '남아프리카 공화국' }, zh: { name: '约翰内斯堡',    country: '南非'         }, es: { name: 'Johannesburgo',   country: 'Sudáfrica'       }, fr: { name: 'Johannesburg',    country: 'Afrique du Sud'  }, hi: { name: 'जोहान्सबर्ग',     country: 'दक्षिण अफ्रीका' }, th: { name: 'โจฮันเนสเบิร์ก',  country: 'แอฟริกาใต้'  } } },
  { slug: 'cairo',        identifier: 'Africa/Cairo',        name: 'Cairo',       country: 'Egypt',        localizations: { ja: { name: 'カイロ',           country: 'エジプト'           }, ko: { name: '카이로',      country: '이집트'            }, zh: { name: '开罗',          country: '埃及'         }, es: { name: 'El Cairo',        country: 'Egipto'          }, fr: { name: 'Le Caire',        country: 'Égypte'          }, hi: { name: 'काहिरा',          country: 'मिस्र'       }, th: { name: 'ไคโร',             country: 'อียิปต์'     } } },
  { slug: 'mexicocity',   identifier: 'America/Mexico_City', name: 'Mexico City', country: 'Mexico',       localizations: { ja: { name: 'メキシコシティ',   country: 'メキシコ'           }, ko: { name: '멕시코시티',  country: '멕시코'            }, zh: { name: '墨西哥城',      country: '墨西哥'       }, es: { name: 'Ciudad de México', country: 'México'          }, fr: { name: 'Mexico',          country: 'Mexique'         }, hi: { name: 'मेक्सिको सिटी',   country: 'मेक्सिको'    }, th: { name: 'เม็กซิโกซิตี้',    country: 'เม็กซิโก'    } } },
  { slug: 'jakarta',      identifier: 'Asia/Jakarta',        name: 'Jakarta',     country: 'Indonesia',    localizations: { ja: { name: 'ジャカルタ',       country: 'インドネシア'       }, ko: { name: '자카르타',    country: '인도네시아'        }, zh: { name: '雅加达',        country: '印度尼西亚'   }, es: { name: 'Yakarta',         country: 'Indonesia'       }, fr: { name: 'Jakarta',         country: 'Indonésie'       }, hi: { name: 'जकार्ता',         country: 'इंडोनेशिया'  }, th: { name: 'จาการ์ตา',         country: 'อินโดนีเซีย' } } },
  { slug: 'auckland',     identifier: 'Pacific/Auckland',    name: 'Auckland',    country: 'New Zealand',  localizations: { ja: { name: 'オークランド',     country: 'ニュージーランド'   }, ko: { name: '오클랜드',    country: '뉴질랜드'          }, zh: { name: '奥克兰',        country: '新西兰'       }, es: { name: 'Auckland',        country: 'Nueva Zelanda'   }, fr: { name: 'Auckland',        country: 'Nouvelle-Zélande'}, hi: { name: 'ऑकलैंड',          country: 'न्यूजीलैंड'  }, th: { name: 'โอ๊คแลนด์',        country: 'นิวซีแลนด์'  } } },
  { slug: 'denver',       identifier: 'America/Denver',      name: 'Denver',      country: 'USA',          localizations: { ja: { name: 'デンバー',         country: 'アメリカ'           }, ko: { name: '덴버',        country: '미국'              }, zh: { name: '丹佛',          country: '美国'         }, es: { name: 'Denver',          country: 'EE. UU.'         }, fr: { name: 'Denver',          country: 'États-Unis'      }, hi: { name: 'डेनवर',           country: 'अमेरिका'     }, th: { name: 'เดนเวอร์',         country: 'สหรัฐอเมริกา' } } },
  { slug: 'lagos',        identifier: 'Africa/Lagos',        name: 'Lagos',       country: 'Nigeria',      localizations: { ja: { name: 'ラゴス',           country: 'ナイジェリア'       }, ko: { name: '라고스',      country: '나이지리아'        }, zh: { name: '拉各斯',        country: '尼日利亚'     }, es: { name: 'Lagos',           country: 'Nigeria'         }, fr: { name: 'Lagos',           country: 'Nigéria'         }, hi: { name: 'लागोस',           country: 'नाइजीरिया'   }, th: { name: 'ลากอส',            country: 'ไนจีเรีย'    } } },
  { slug: 'nairobi',      identifier: 'Africa/Nairobi',      name: 'Nairobi',     country: 'Kenya',        localizations: { ja: { name: 'ナイロビ',         country: 'ケニア'             }, ko: { name: '나이로비',    country: '케냐'              }, zh: { name: '内罗毕',        country: '肯尼亚'       }, es: { name: 'Nairobi',         country: 'Kenia'           }, fr: { name: 'Nairobi',         country: 'Kenya'           }, hi: { name: 'नैरोबी',          country: 'केन्या'      }, th: { name: 'ไนโรบี',           country: 'เคนยา'       } } },
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
