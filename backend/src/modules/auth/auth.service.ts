import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  // Delegates JIT provisioning to UsersService (called from JwtStrategy.validate)
  async findOrCreateUser(
    supabaseId: string,
    email: string,
    displayName?: string,
  ) {
    return this.usersService.findOrCreateFromSupabase(
      supabaseId,
      email,
      displayName,
    );
  }
}
