import { Prisma, UserRole, type User } from '@/generated/prisma/client';
import { prisma } from './db';
import { HttpError } from './http';

// Syncs a Supabase user into our own users table on first sign-in (JIT provisioning).
// Rows are matched only by supabaseId. Linking by email is deliberately not done: every
// row already has a supabaseId, so re-linking would hand one identity's data to another
// (e.g. after an email change or account deletion).
export async function findOrCreateFromSupabase(
  supabaseId: string,
  email: string,
  displayName?: string,
): Promise<User> {
  const existing = await prisma.user.findUnique({ where: { supabaseId } });
  if (existing) {
    if (existing.email === email) return existing;
    try {
      return await prisma.user.update({ where: { supabaseId }, data: { email } });
    } catch (err) {
      if (isUniqueViolation(err)) throw emailTaken();
      throw err;
    }
  }

  try {
    return await prisma.user.create({
      data: { supabaseId, email, displayName, role: UserRole.user },
    });
  } catch (err) {
    if (!isUniqueViolation(err)) throw err;
    // Another request created this user just before us...
    const created = await prisma.user.findUnique({ where: { supabaseId } });
    if (created) return created;
    // ...or the email belongs to a different Supabase identity.
    throw emailTaken();
  }
}

// P2002 = unique constraint violation
function isUniqueViolation(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
}

function emailTaken() {
  return new HttpError(409, 'This email is already linked to another account');
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    createdAt: user.createdAt,
  };
}
