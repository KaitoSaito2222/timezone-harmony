import { Prisma, UserRole, type User } from '@/generated/prisma/client';
import { prisma } from './db';

// Syncs a Supabase user into our own users table on first sign-in (JIT provisioning).
export async function findOrCreateFromSupabase(
  supabaseId: string,
  email: string,
  displayName?: string,
): Promise<User> {
  // 1. Look up by supabaseId (most common case)
  const bySupabaseId = await prisma.user.findUnique({ where: { supabaseId } });
  if (bySupabaseId) {
    if (bySupabaseId.email !== email) {
      return prisma.user.update({ where: { supabaseId }, data: { email } });
    }
    return bySupabaseId;
  }

  // 2. Link the auth ID to an existing user with the same email
  const byEmail = await prisma.user.findUnique({ where: { email } });
  if (byEmail) {
    return prisma.user.update({ where: { email }, data: { supabaseId } });
  }

  // 3. Create new user (catch race condition: concurrent requests may reach here simultaneously)
  try {
    return await prisma.user.create({
      data: { supabaseId, email, displayName, role: UserRole.user },
    });
  } catch (err) {
    // P2002 = unique constraint violation: another request created the user just before us
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return (
        (await prisma.user.findUnique({ where: { supabaseId } })) ??
        prisma.user.findUniqueOrThrow({ where: { email } })
      );
    }
    throw err;
  }
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
