import { useLocale } from 'next-intl';
import { getLocaleMeta } from '@/i18n/localeConfig';

export function useLocaleConfig() {
  const locale = useLocale();
  const meta = getLocaleMeta(locale);
  return {
    locale,
    use24h: meta.use24h,
    localePath: meta.pathPrefix,
    headerDateFormat: meta.headerDateFormat,
    headerShortDateFormat: meta.headerShortDateFormat,
  };
}
