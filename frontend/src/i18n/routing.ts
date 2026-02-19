import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ja'],
  defaultLocale: 'en',
  // English has no URL prefix (/cities/...), Japanese gets /ja/ prefix
  localePrefix: 'always',
});
