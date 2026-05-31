import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Legacy `/cities/*` URLs were removed in the Feb 2026 migration to `/[pair]`.
// They have 404'd for months, so return 410 Gone to let search engines
// deindex them quickly. Handled here (Netlify Edge Function) because
// next.config `redirects()` does not fire on this Netlify + next-intl setup.
// Matches `/cities`, `/cities/...`, and `/<locale>/cities/...`.
const LEGACY_CITIES = /^\/(?:[a-z]{2}\/)?cities(?:\/|$)/;

export default function proxy(request: NextRequest) {
  if (LEGACY_CITIES.test(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 410 });
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|opengraph-image|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)|.*/auth/callback).*)',
  ],
};
