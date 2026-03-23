import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|opengraph-image|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)|.*/auth/callback).*)',
  ],
};
