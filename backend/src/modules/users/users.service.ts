import { Injectable } from '@nestjs/common';
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
    let user = await this.findBySupabaseId(supabaseId);
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          supabaseId,
          email,
          displayName,
          role: UserRole.user,
        },
      });
    }
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
