import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('SUPABASE_JWT_SECRET') || 'temp-secret',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    // JIT provisioning: Retrieve or create the app-side User from the Supabase user UUID (sub)
    const user = await this.usersService.findOrCreateFromSupabase(
      payload.sub,
      payload.email,
    );
    return { userId: user.id, email: user.email };
  }
}
