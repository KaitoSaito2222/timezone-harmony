import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import * as jwksRsa from 'jwks-rsa';

// Validates incoming requests by verifying the Supabase-issued JWT.
// Flow: extract Bearer token → verify signature via JWKS → call validate()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');

    super({
      // Step 1: Extract JWT from "Authorization: Bearer <token>" header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Step 2: Verify JWT signature using Supabase public keys (no secret key needed on our side)
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
      }),
      algorithms: ['ES256'], // Supabase uses ES256 for new projects
    });
  }

  // Step 3: Called after signature is verified. payload.sub is the Supabase user UUID.
  // Performs JIT provisioning: syncs the Supabase user into our own users table on first login.
  // The returned object is attached to request.user in downstream controllers.
  async validate(payload: { sub: string; email: string }) {
    const user = await this.usersService.findOrCreateFromSupabase(
      payload.sub,
      payload.email,
    );
    return { userId: user.id, email: user.email };
  }
}
