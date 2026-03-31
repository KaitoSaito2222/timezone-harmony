/**
 * Per-locale metadata used for SEO and UI rendering.
 * Adding a new language only requires adding an entry here
 * (plus routing.ts and messages/<locale>.json).
 */

interface LocaleMeta {
  /** URL path prefix. Empty string = default locale (English at root). */
  pathPrefix: string;
  /** BCP 47 locale tag used in OpenGraph og:locale. */
  ogLocale: string;
  /** Whether to use 24-hour time display. */
  use24h: boolean;
  /** Luxon date format string for the city pair page header (e.g. "EEE, MMM d"). */
  dateFormat: string;
  /** Luxon date format for timeline column headers including year (e.g. "Mar 30, 2026 21:41"). */
  headerDateFormat: string;
  /** Luxon date format for timeline row headers without year (e.g. "Mar 30, 21:41"). */
  headerShortDateFormat: string;
  /** SEO keywords for the home page. */
  homeKeywords: string[];
  /** SEO keywords appended to city names on city pair pages. */
  cityKeywords: string[];
}

const config: Record<string, LocaleMeta> = {
  en: {
    pathPrefix: '',
    ogLocale: 'en_US',
    use24h: false,
    dateFormat: 'EEE, MMM d',
    headerDateFormat: 'MMM d, yyyy HH:mm',
    headerShortDateFormat: 'MMM d, HH:mm',
    homeKeywords: [
      'timezone', 'time zone converter', 'world clock',
      'meeting planner', 'timezone comparison', 'global team',
    ],
    cityKeywords: ['time difference', 'timezone', 'local time', 'world clock'],
  },
  ja: {
    pathPrefix: '/ja',
    ogLocale: 'ja_JP',
    use24h: true,
    dateFormat: 'M月d日(ccc)',
    headerDateFormat: 'M月d日(ccc) HH:mm',
    headerShortDateFormat: 'M月d日 HH:mm',
    homeKeywords: [
      '時差計算', 'タイムゾーン', '時差', '世界時計',
      'ミーティング計画', 'タイムゾーン比較', 'グローバルチーム',
    ],
    cityKeywords: ['時差計算', '時差', 'タイムゾーン', '現地時刻', '世界時計'],
  },
  ko: {
    pathPrefix: '/ko',
    ogLocale: 'ko_KR',
    use24h: true,
    dateFormat: 'M월 d일(ccc)',
    headerDateFormat: 'M월 d일(ccc) HH:mm',
    headerShortDateFormat: 'M월 d일 HH:mm',
    homeKeywords: [
      '시차 계산', '시간대', '시차', '세계 시계',
      '미팅 계획', '시간대 비교', '글로벌 팀',
    ],
    cityKeywords: ['시차 계산', '시차', '시간대', '현지 시각', '세계 시계'],
  },
};

/** Returns locale metadata, falling back to English for unknown locales. */
export function getLocaleMeta(locale: string): LocaleMeta {
  return config[locale] ?? config.en;
}

/**
 * Builds the `alternates.languages` map for Next.js metadata.
 * Automatically includes all configured locales + x-default (English root).
 *
 * @param baseUrl  Site base URL (e.g. https://timezone-harmony.com)
 * @param pairPath Optional path suffix (e.g. "tokyo-newyork")
 */
export function buildLanguageAlternates(
  baseUrl: string,
  pairPath?: string,
): Record<string, string> {
  const suffix = pairPath ? `/${pairPath}` : '';
  const entries = Object.entries(config).map(([code, meta]) => [
    code,
    `${baseUrl}${meta.pathPrefix}${suffix}`,
  ]);
  return {
    ...Object.fromEntries(entries),
    'x-default': `${baseUrl}${suffix}`,
  };
}
