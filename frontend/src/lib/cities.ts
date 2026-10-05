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
  // Added Oct 2026: expanded coverage for Asia, Middle East, Europe and the Americas
  { slug: 'manila', identifier: 'Asia/Manila', name: 'Manila', country: 'Philippines', localizations: { ja: { name: 'マニラ', country: 'フィリピン' }, ko: { name: '마닐라', country: '필리핀' }, zh: { name: '马尼拉', country: '菲律宾' }, es: { name: 'Manila', country: 'Filipinas' }, fr: { name: 'Manille', country: 'Philippines' }, hi: { name: 'मनीला', country: 'फ़िलीपींस' }, th: { name: 'มะนิลา', country: 'ฟิลิปปินส์' } } },
  { slug: 'hochiminh', identifier: 'Asia/Ho_Chi_Minh', name: 'Ho Chi Minh City', country: 'Vietnam', localizations: { ja: { name: 'ホーチミン', country: 'ベトナム' }, ko: { name: '호치민', country: '베트남' }, zh: { name: '胡志明市', country: '越南' }, es: { name: 'Ciudad Ho Chi Minh', country: 'Vietnam' }, fr: { name: 'Hô Chi Minh-Ville', country: 'Viêt Nam' }, hi: { name: 'हो ची मिन्ह सिटी', country: 'वियतनाम' }, th: { name: 'โฮจิมินห์', country: 'เวียดนาม' } } },
  { slug: 'taipei', identifier: 'Asia/Taipei', name: 'Taipei', country: 'Taiwan', localizations: { ja: { name: '台北', country: '台湾' }, ko: { name: '타이베이', country: '대만' }, zh: { name: '台北', country: '台湾' }, es: { name: 'Taipéi', country: 'Taiwán' }, fr: { name: 'Taipei', country: 'Taïwan' }, hi: { name: 'ताइपे', country: 'ताइवान' }, th: { name: 'ไทเป', country: 'ไต้หวัน' } } },
  { slug: 'delhi', identifier: 'Asia/Kolkata', name: 'Delhi', country: 'India', localizations: { ja: { name: 'デリー', country: 'インド' }, ko: { name: '델리', country: '인도' }, zh: { name: '德里', country: '印度' }, es: { name: 'Delhi', country: 'India' }, fr: { name: 'Delhi', country: 'Inde' }, hi: { name: 'दिल्ली', country: 'भारत' }, th: { name: 'เดลี', country: 'อินเดีย' } } },
  { slug: 'karachi', identifier: 'Asia/Karachi', name: 'Karachi', country: 'Pakistan', localizations: { ja: { name: 'カラチ', country: 'パキスタン' }, ko: { name: '카라치', country: '파키스탄' }, zh: { name: '卡拉奇', country: '巴基斯坦' }, es: { name: 'Karachi', country: 'Pakistán' }, fr: { name: 'Karachi', country: 'Pakistan' }, hi: { name: 'कराची', country: 'पाकिस्तान' }, th: { name: 'การาจี', country: 'ปากีสถาน' } } },
  { slug: 'dhaka', identifier: 'Asia/Dhaka', name: 'Dhaka', country: 'Bangladesh', localizations: { ja: { name: 'ダッカ', country: 'バングラデシュ' }, ko: { name: '다카', country: '방글라데시' }, zh: { name: '达卡', country: '孟加拉国' }, es: { name: 'Daca', country: 'Bangladés' }, fr: { name: 'Dacca', country: 'Bangladesh' }, hi: { name: 'ढाका', country: 'बांग्लादेश' }, th: { name: 'ธากา', country: 'บังกลาเทศ' } } },
  { slug: 'kathmandu', identifier: 'Asia/Kathmandu', name: 'Kathmandu', country: 'Nepal', localizations: { ja: { name: 'カトマンズ', country: 'ネパール' }, ko: { name: '카트만두', country: '네팔' }, zh: { name: '加德满都', country: '尼泊尔' }, es: { name: 'Katmandú', country: 'Nepal' }, fr: { name: 'Katmandou', country: 'Népal' }, hi: { name: 'काठमांडू', country: 'नेपाल' }, th: { name: 'กาฐมาณฑุ', country: 'เนปาล' } } },
  { slug: 'colombo', identifier: 'Asia/Colombo', name: 'Colombo', country: 'Sri Lanka', localizations: { ja: { name: 'コロンボ', country: 'スリランカ' }, ko: { name: '콜롬보', country: '스리랑카' }, zh: { name: '科伦坡', country: '斯里兰卡' }, es: { name: 'Colombo', country: 'Sri Lanka' }, fr: { name: 'Colombo', country: 'Sri Lanka' }, hi: { name: 'कोलंबो', country: 'श्रीलंका' }, th: { name: 'โคลัมโบ', country: 'ศรีลังกา' } } },
  { slug: 'beijing', identifier: 'Asia/Shanghai', name: 'Beijing', country: 'China', localizations: { ja: { name: '北京', country: '中国' }, ko: { name: '베이징', country: '중국' }, zh: { name: '北京', country: '中国' }, es: { name: 'Pekín', country: 'China' }, fr: { name: 'Pékin', country: 'Chine' }, hi: { name: 'बीजिंग', country: 'चीन' }, th: { name: 'ปักกิ่ง', country: 'จีน' } } },
  { slug: 'osaka', identifier: 'Asia/Tokyo', name: 'Osaka', country: 'Japan', localizations: { ja: { name: '大阪', country: '日本' }, ko: { name: '오사카', country: '일본' }, zh: { name: '大阪', country: '日本' }, es: { name: 'Osaka', country: 'Japón' }, fr: { name: 'Osaka', country: 'Japon' }, hi: { name: 'ओसाका', country: 'जापान' }, th: { name: 'โอซากา', country: 'ญี่ปุ่น' } } },
  { slug: 'doha', identifier: 'Asia/Qatar', name: 'Doha', country: 'Qatar', localizations: { ja: { name: 'ドーハ', country: 'カタール' }, ko: { name: '도하', country: '카타르' }, zh: { name: '多哈', country: '卡塔尔' }, es: { name: 'Doha', country: 'Catar' }, fr: { name: 'Doha', country: 'Qatar' }, hi: { name: 'दोहा', country: 'क़तर' }, th: { name: 'โดฮา', country: 'กาตาร์' } } },
  { slug: 'riyadh', identifier: 'Asia/Riyadh', name: 'Riyadh', country: 'Saudi Arabia', localizations: { ja: { name: 'リヤド', country: 'サウジアラビア' }, ko: { name: '리야드', country: '사우디아라비아' }, zh: { name: '利雅得', country: '沙特阿拉伯' }, es: { name: 'Riad', country: 'Arabia Saudita' }, fr: { name: 'Riyad', country: 'Arabie saoudite' }, hi: { name: 'रियाद', country: 'सऊदी अरब' }, th: { name: 'ริยาด', country: 'ซาอุดีอาระเบีย' } } },
  { slug: 'tehran', identifier: 'Asia/Tehran', name: 'Tehran', country: 'Iran', localizations: { ja: { name: 'テヘラン', country: 'イラン' }, ko: { name: '테헤란', country: '이란' }, zh: { name: '德黑兰', country: '伊朗' }, es: { name: 'Teherán', country: 'Irán' }, fr: { name: 'Téhéran', country: 'Iran' }, hi: { name: 'तेहरान', country: 'ईरान' }, th: { name: 'เตหะราน', country: 'อิหร่าน' } } },
  { slug: 'telaviv', identifier: 'Asia/Jerusalem', name: 'Tel Aviv', country: 'Israel', localizations: { ja: { name: 'テルアビブ', country: 'イスラエル' }, ko: { name: '텔아비브', country: '이스라엘' }, zh: { name: '特拉维夫', country: '以色列' }, es: { name: 'Tel Aviv', country: 'Israel' }, fr: { name: 'Tel Aviv', country: 'Israël' }, hi: { name: 'तेल अवीव', country: 'इज़राइल' }, th: { name: 'เทลอาวีฟ', country: 'อิสราเอล' } } },
  { slug: 'rome', identifier: 'Europe/Rome', name: 'Rome', country: 'Italy', localizations: { ja: { name: 'ローマ', country: 'イタリア' }, ko: { name: '로마', country: '이탈리아' }, zh: { name: '罗马', country: '意大利' }, es: { name: 'Roma', country: 'Italia' }, fr: { name: 'Rome', country: 'Italie' }, hi: { name: 'रोम', country: 'इटली' }, th: { name: 'โรม', country: 'อิตาลี' } } },
  { slug: 'lisbon', identifier: 'Europe/Lisbon', name: 'Lisbon', country: 'Portugal', localizations: { ja: { name: 'リスボン', country: 'ポルトガル' }, ko: { name: '리스본', country: '포르투갈' }, zh: { name: '里斯本', country: '葡萄牙' }, es: { name: 'Lisboa', country: 'Portugal' }, fr: { name: 'Lisbonne', country: 'Portugal' }, hi: { name: 'लिस्बन', country: 'पुर्तगाल' }, th: { name: 'ลิสบอน', country: 'โปรตุเกส' } } },
  { slug: 'dublin', identifier: 'Europe/Dublin', name: 'Dublin', country: 'Ireland', localizations: { ja: { name: 'ダブリン', country: 'アイルランド' }, ko: { name: '더블린', country: '아일랜드' }, zh: { name: '都柏林', country: '爱尔兰' }, es: { name: 'Dublín', country: 'Irlanda' }, fr: { name: 'Dublin', country: 'Irlande' }, hi: { name: 'डबलिन', country: 'आयरलैंड' }, th: { name: 'ดับลิน', country: 'ไอร์แลนด์' } } },
  { slug: 'zurich', identifier: 'Europe/Zurich', name: 'Zurich', country: 'Switzerland', localizations: { ja: { name: 'チューリッヒ', country: 'スイス' }, ko: { name: '취리히', country: '스위스' }, zh: { name: '苏黎世', country: '瑞士' }, es: { name: 'Zúrich', country: 'Suiza' }, fr: { name: 'Zurich', country: 'Suisse' }, hi: { name: 'ज्यूरिख', country: 'स्विट्ज़रलैंड' }, th: { name: 'ซูริก', country: 'สวิตเซอร์แลนด์' } } },
  { slug: 'stockholm', identifier: 'Europe/Stockholm', name: 'Stockholm', country: 'Sweden', localizations: { ja: { name: 'ストックホルム', country: 'スウェーデン' }, ko: { name: '스톡홀름', country: '스웨덴' }, zh: { name: '斯德哥尔摩', country: '瑞典' }, es: { name: 'Estocolmo', country: 'Suecia' }, fr: { name: 'Stockholm', country: 'Suède' }, hi: { name: 'स्टॉकहोम', country: 'स्वीडन' }, th: { name: 'สตอกโฮล์ม', country: 'สวีเดน' } } },
  { slug: 'warsaw', identifier: 'Europe/Warsaw', name: 'Warsaw', country: 'Poland', localizations: { ja: { name: 'ワルシャワ', country: 'ポーランド' }, ko: { name: '바르샤바', country: '폴란드' }, zh: { name: '华沙', country: '波兰' }, es: { name: 'Varsovia', country: 'Polonia' }, fr: { name: 'Varsovie', country: 'Pologne' }, hi: { name: 'वारसॉ', country: 'पोलैंड' }, th: { name: 'วอร์ซอ', country: 'โปแลนด์' } } },
  { slug: 'athens', identifier: 'Europe/Athens', name: 'Athens', country: 'Greece', localizations: { ja: { name: 'アテネ', country: 'ギリシャ' }, ko: { name: '아테네', country: '그리스' }, zh: { name: '雅典', country: '希腊' }, es: { name: 'Atenas', country: 'Grecia' }, fr: { name: 'Athènes', country: 'Grèce' }, hi: { name: 'एथेंस', country: 'यूनान' }, th: { name: 'เอเธนส์', country: 'กรีซ' } } },
  { slug: 'kyiv', identifier: 'Europe/Kiev', name: 'Kyiv', country: 'Ukraine', localizations: { ja: { name: 'キーウ', country: 'ウクライナ' }, ko: { name: '키이우', country: '우크라이나' }, zh: { name: '基辅', country: '乌克兰' }, es: { name: 'Kiev', country: 'Ucrania' }, fr: { name: 'Kyiv', country: 'Ukraine' }, hi: { name: 'कीव', country: 'यूक्रेन' }, th: { name: 'เคียฟ', country: 'ยูเครน' } } },
  { slug: 'vienna', identifier: 'Europe/Vienna', name: 'Vienna', country: 'Austria', localizations: { ja: { name: 'ウィーン', country: 'オーストリア' }, ko: { name: '빈', country: '오스트리아' }, zh: { name: '维也纳', country: '奥地利' }, es: { name: 'Viena', country: 'Austria' }, fr: { name: 'Vienne', country: 'Autriche' }, hi: { name: 'वियना', country: 'ऑस्ट्रिया' }, th: { name: 'เวียนนา', country: 'ออสเตรีย' } } },
  { slug: 'sanfrancisco', identifier: 'America/Los_Angeles', name: 'San Francisco', country: 'USA', localizations: { ja: { name: 'サンフランシスコ', country: 'アメリカ' }, ko: { name: '샌프란시스코', country: '미국' }, zh: { name: '旧金山', country: '美国' }, es: { name: 'San Francisco', country: 'EE. UU.' }, fr: { name: 'San Francisco', country: 'États-Unis' }, hi: { name: 'सैन फ़्रांसिस्को', country: 'अमेरिका' }, th: { name: 'ซานฟรานซิสโก', country: 'สหรัฐอเมริกา' } } },
  { slug: 'vancouver', identifier: 'America/Vancouver', name: 'Vancouver', country: 'Canada', localizations: { ja: { name: 'バンクーバー', country: 'カナダ' }, ko: { name: '밴쿠버', country: '캐나다' }, zh: { name: '温哥华', country: '加拿大' }, es: { name: 'Vancouver', country: 'Canadá' }, fr: { name: 'Vancouver', country: 'Canada' }, hi: { name: 'वैंकूवर', country: 'कनाडा' }, th: { name: 'แวนคูเวอร์', country: 'แคนาดา' } } },
  { slug: 'bogota', identifier: 'America/Bogota', name: 'Bogota', country: 'Colombia', localizations: { ja: { name: 'ボゴタ', country: 'コロンビア' }, ko: { name: '보고타', country: '콜롬비아' }, zh: { name: '波哥大', country: '哥伦比亚' }, es: { name: 'Bogotá', country: 'Colombia' }, fr: { name: 'Bogota', country: 'Colombie' }, hi: { name: 'बोगोटा', country: 'कोलंबिया' }, th: { name: 'โบโกตา', country: 'โคลอมเบีย' } } },
  { slug: 'lima', identifier: 'America/Lima', name: 'Lima', country: 'Peru', localizations: { ja: { name: 'リマ', country: 'ペルー' }, ko: { name: '리마', country: '페루' }, zh: { name: '利马', country: '秘鲁' }, es: { name: 'Lima', country: 'Perú' }, fr: { name: 'Lima', country: 'Pérou' }, hi: { name: 'लीमा', country: 'पेरू' }, th: { name: 'ลิมา', country: 'เปรู' } } },
  { slug: 'buenosaires', identifier: 'America/Argentina/Buenos_Aires', name: 'Buenos Aires', country: 'Argentina', localizations: { ja: { name: 'ブエノスアイレス', country: 'アルゼンチン' }, ko: { name: '부에노스아이레스', country: '아르헨티나' }, zh: { name: '布宜诺斯艾利斯', country: '阿根廷' }, es: { name: 'Buenos Aires', country: 'Argentina' }, fr: { name: 'Buenos Aires', country: 'Argentine' }, hi: { name: 'ब्यूनस आयर्स', country: 'अर्जेंटीना' }, th: { name: 'บัวโนสไอเรส', country: 'อาร์เจนตินา' } } },
  { slug: 'santiago', identifier: 'America/Santiago', name: 'Santiago', country: 'Chile', localizations: { ja: { name: 'サンティアゴ', country: 'チリ' }, ko: { name: '산티아고', country: '칠레' }, zh: { name: '圣地亚哥', country: '智利' }, es: { name: 'Santiago', country: 'Chile' }, fr: { name: 'Santiago', country: 'Chili' }, hi: { name: 'सैंटियागो', country: 'चिली' }, th: { name: 'ซานติอาโก', country: 'ชิลี' } } },
  { slug: 'honolulu', identifier: 'Pacific/Honolulu', name: 'Honolulu', country: 'USA', localizations: { ja: { name: 'ホノルル', country: 'アメリカ' }, ko: { name: '호놀룰루', country: '미국' }, zh: { name: '檀香山', country: '美国' }, es: { name: 'Honolulu', country: 'EE. UU.' }, fr: { name: 'Honolulu', country: 'États-Unis' }, hi: { name: 'होनोलूलू', country: 'अमेरिका' }, th: { name: 'โฮโนลูลู', country: 'สหรัฐอเมริกา' } } },
  { slug: 'casablanca', identifier: 'Africa/Casablanca', name: 'Casablanca', country: 'Morocco', localizations: { ja: { name: 'カサブランカ', country: 'モロッコ' }, ko: { name: '카사블랑카', country: '모로코' }, zh: { name: '卡萨布兰卡', country: '摩洛哥' }, es: { name: 'Casablanca', country: 'Marruecos' }, fr: { name: 'Casablanca', country: 'Maroc' }, hi: { name: 'कैसाब्लांका', country: 'मोरक्को' }, th: { name: 'คาซาบลังกา', country: 'โมร็อกโก' } } },
  { slug: 'melbourne', identifier: 'Australia/Melbourne', name: 'Melbourne', country: 'Australia', localizations: { ja: { name: 'メルボルン', country: 'オーストラリア' }, ko: { name: '멜버른', country: '호주' }, zh: { name: '墨尔本', country: '澳大利亚' }, es: { name: 'Melbourne', country: 'Australia' }, fr: { name: 'Melbourne', country: 'Australie' }, hi: { name: 'मेलबर्न', country: 'ऑस्ट्रेलिया' }, th: { name: 'เมลเบิร์น', country: 'ออสเตรเลีย' } } },
  { slug: 'perth', identifier: 'Australia/Perth', name: 'Perth', country: 'Australia', localizations: { ja: { name: 'パース', country: 'オーストラリア' }, ko: { name: '퍼스', country: '호주' }, zh: { name: '珀斯', country: '澳大利亚' }, es: { name: 'Perth', country: 'Australia' }, fr: { name: 'Perth', country: 'Australie' }, hi: { name: 'पर्थ', country: 'ऑस्ट्रेलिया' }, th: { name: 'เพิร์ท', country: 'ออสเตรเลีย' } } },
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
 * Localized city name for an IANA identifier, or null when the identifier is
 * shared by several cities (e.g. Asia/Kolkata → Mumbai/Delhi) or unknown.
 */
export function getUniqueCityNameByIdentifier(identifier: string, locale: string): string | null {
  const matches = CITIES.filter(c => c.identifier === identifier);
  return matches.length === 1 ? getCityLocalized(matches[0], locale).name : null;
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

/**
 * Country → representative city. Lets URLs like `/jakarta-thailand` or
 * `/time/japan` resolve to the canonical city URL (people search by country).
 */
export const COUNTRY_ALIASES: Record<string, string> = {
  japan: 'tokyo', thailand: 'bangkok', korea: 'seoul', southkorea: 'seoul',
  china: 'beijing', taiwan: 'taipei', india: 'delhi', indonesia: 'jakarta',
  malaysia: 'kualalumpur', vietnam: 'hochiminh', philippines: 'manila',
  pakistan: 'karachi', bangladesh: 'dhaka', nepal: 'kathmandu', srilanka: 'colombo',
  uae: 'dubai', emirates: 'dubai', qatar: 'doha', saudiarabia: 'riyadh', saudi: 'riyadh',
  iran: 'tehran', israel: 'telaviv', turkey: 'istanbul', russia: 'moscow',
  uk: 'london', england: 'london', britain: 'london', france: 'paris', germany: 'berlin',
  italy: 'rome', spain: 'madrid', portugal: 'lisbon', ireland: 'dublin',
  netherlands: 'amsterdam', switzerland: 'zurich', sweden: 'stockholm', poland: 'warsaw',
  greece: 'athens', ukraine: 'kyiv', austria: 'vienna',
  usa: 'newyork', us: 'newyork', canada: 'toronto', mexico: 'mexicocity',
  brazil: 'saopaulo', argentina: 'buenosaires', chile: 'santiago', colombia: 'bogota', peru: 'lima',
  australia: 'sydney', newzealand: 'auckland', egypt: 'cairo', nigeria: 'lagos',
  kenya: 'nairobi', southafrica: 'johannesburg', morocco: 'casablanca',
  singaporecity: 'singapore',
};

/** Resolves a city slug or country alias to a CityDef, or null. */
export function resolveCity(slugOrAlias: string): CityDef | null {
  const key = slugOrAlias.toLowerCase();
  return CITY_MAP.get(key) ?? CITY_MAP.get(COUNTRY_ALIASES[key] ?? '') ?? null;
}

/**
 * Rewrites country aliases inside a pair string to city slugs
 * ("jakarta-thailand" → "bangkok-jakarta"). Returns null when nothing can be
 * resolved, the result has duplicate cities, or the input is already canonical.
 */
export function resolvePairAliases(pair: string): string | null {
  const parts = pair.split('-');
  if (parts.length < 2 || parts.length > 3) return null;
  const cities = parts.map(resolveCity);
  if (cities.some(c => !c)) return null;
  const slugs = cities.map(c => c!.slug);
  if (new Set(slugs).size !== slugs.length) return null;
  const resolved = [...slugs].sort().join('-');
  return resolved === pair ? null : resolved;
}

/** Canonical (alphabetical) form of a pair slug: "mumbai-london" → "london-mumbai". */
function canonicalSlug(slug: string): string {
  return slug.split('-').sort().join('-');
}

/**
 * Two-city pairs worth indexing: the hand-picked popular pairs plus every
 * combination of the popular cities. All other combinations stay reachable
 * for users but are marked noindex, so search engines only see the pages
 * that have real search demand.
 */
export function getIndexablePairSlugs(): string[] {
  const popular = [...POPULAR_SLUGS].sort();
  const slugs = new Set<string>(POPULAR_PAIRS.map(p => canonicalSlug(p.slug)));
  for (let i = 0; i < popular.length; i++)
    for (let j = i + 1; j < popular.length; j++)
      slugs.add(`${popular[i]}-${popular[j]}`);
  return [...slugs].sort();
}

let indexablePairSet: Set<string> | null = null;

/** True when the page for this canonical pair/triplet slug should be indexed. */
export function isIndexablePair(slug: string): boolean {
  // Built lazily: POPULAR_SLUGS / POPULAR_PAIRS are declared further down.
  indexablePairSet ??= new Set(getIndexablePairSlugs());
  return indexablePairSet.has(slug);
}

/**
 * Pairs rendered at build time. Everything else is rendered on first request
 * (ISR via dynamicParams) so the build does not grow quadratically with cities.
 */
export function getStaticPairSlugs(): string[] {
  return getIndexablePairSlugs();
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
