import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findBySupabaseId(supabaseId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { supabaseId } });
  }

  async findOrCreateFromSupabase(
    supabaseId: string,
    email: string,
    displayName?: string,
  ): Promise<User> {
    // 1. Look up by supabaseId (most common case)
    const bySupabaseId = await this.prisma.user.findUnique({
      where: { supabaseId },
    });
    if (bySupabaseId) {
      if (bySupabaseId.email !== email) {
        return this.prisma.user.update({
          where: { supabaseId },
          data: { email },
        });
      }
      return bySupabaseId;
    }

    // 2. Link the auth ID to an existing user with the same email
    const byEmail = await this.prisma.user.findUnique({ where: { email } });
    if (byEmail) {
      return this.prisma.user.update({
        where: { email },
        data: { supabaseId },
      });
    }

    // 3. Create new user (catch race condition: concurrent requests may reach here simultaneously)
    try {
      return await this.prisma.user.create({
        data: { supabaseId, email, displayName, role: UserRole.user },
      });
    } catch (err) {
      // P2002 = unique constraint violation: another request created the user just before us
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        return (
          (await this.prisma.user.findUnique({ where: { supabaseId } })) ??
          this.prisma.user.findUniqueOrThrow({ where: { email } })
        );
      }
      throw err;
    }
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
