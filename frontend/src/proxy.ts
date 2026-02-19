import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // Step 1: Run next-intl middleware for locale detection and URL rewriting.
  // This may return a redirect (e.g. browser language → /ja/) or a 200 rewrite.
  const intlResponse = intlMiddleware(request);

  // Step 2: If it's a redirect, return immediately — no need to attach Supabase cookies.
  if (intlResponse.status !== 200) {
    return intlResponse;
  }

  // Step 3: Run Supabase session refresh on top of the intl response,
  // preserving the locale rewrite headers set by next-intl.
  let supabaseResponse = intlResponse;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Rebuild from intlResponse to keep locale rewrite headers intact
          supabaseResponse = NextResponse.next({ request });
          intlResponse.headers.forEach((value, key) => {
            supabaseResponse.headers.set(key, value);
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session to prevent expiry
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
