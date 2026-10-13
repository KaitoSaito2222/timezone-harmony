import 'server-only';
import { createRemoteJWKSet, errors, jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { unauthorized } from './http';
import { findOrCreateFromSupabase } from './users';

export interface AuthUser {
  userId: string;
  email: string;
}

// Supabase signs access tokens with ES256; the public keys are fetched from its JWKS
// endpoint and cached by jose, so no secret is needed on our side.
let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;
function getJwks() {
  jwks ??= createRemoteJWKSet(
    new URL('/auth/v1/.well-known/jwks.json', process.env.NEXT_PUBLIC_SUPABASE_URL),
  );
  return jwks;
}

async function verifyToken(req: NextRequest): Promise<{ sub: string; email: string } | undefined> {
  const token = req.headers.get('authorization')?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return undefined;
  try {
    const { payload } = await jwtVerify<{ email?: string }>(token, getJwks(), {
      algorithms: ['ES256'],
    });
    if (!payload.sub || !payload.email) return undefined;
    return { sub: payload.sub, email: payload.email };
  } catch (error) {
    if (isInvalidToken(error)) return undefined;
    // Anything else (e.g. the JWKS could not be fetched) is our failure, not the user's:
    // let it become a 500 so the client does not sign the user out.
    throw error;
  }
}

function isInvalidToken(error: unknown): boolean {
  return (
    error instanceof errors.JWTExpired ||
    error instanceof errors.JWTClaimValidationFailed ||
    error instanceof errors.JWTInvalid ||
    error instanceof errors.JWSInvalid ||
    error instanceof errors.JWSSignatureVerificationFailed ||
    error instanceof errors.JWKSNoMatchingKey ||
    error instanceof errors.JWKSMultipleMatchingKeys ||
    error instanceof errors.JOSEAlgNotAllowed ||
    error instanceof errors.JOSENotSupported
  );
}

// Database errors are not caught here: they must surface as 500s, not as a 401
// that would sign the user out.
async function authenticate(req: NextRequest): Promise<AuthUser | undefined> {
  const claims = await verifyToken(req);
  if (!claims) return undefined;
  const user = await findOrCreateFromSupabase(claims.sub, claims.email);
  return { userId: user.id, email: user.email };
}

/** The signed-in user; responds 401 when the token is missing or invalid. */
export async function requireUser(req: NextRequest): Promise<AuthUser> {
  const user = await authenticate(req);
  if (!user) throw unauthorized();
  return user;
}

/** The signed-in user, or undefined for anonymous visitors (never rejects). */
export async function optionalUser(req: NextRequest): Promise<AuthUser | undefined> {
  try {
    return await authenticate(req);
  } catch (error) {
    console.error('Failed to resolve the signed-in user; continuing anonymously', error);
    return undefined;
  }
}
