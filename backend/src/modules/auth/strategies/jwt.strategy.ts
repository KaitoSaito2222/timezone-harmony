import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
      }),
      algorithms: ['ES256'], // Supabase uses ES256 for new projects
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
