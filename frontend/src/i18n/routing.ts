import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ja', 'ko', 'zh', 'es', 'fr', 'hi', 'th'],
  defaultLocale: 'en',
  // English has no URL prefix (/cities/...), Japanese gets /ja/ prefix
  localePrefix: 'as-needed',
});
