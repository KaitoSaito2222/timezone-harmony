import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../../entities';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await this.usersService.validatePassword(user, password))) {
      return user;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateTokens(user);
  }

  async register(email: string, password: string, displayName?: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const user = await this.usersService.create({
      email,
      password,
      displayName,
    });

    return this.generateTokens(user);
  }

  async validateGoogleUser(profile: {
    googleId: string;
    email: string;
    displayName: string;
  }): Promise<User> {
    let user = await this.usersService.findByGoogleId(profile.googleId);
    if (!user) {
      user = await this.usersService.findByEmail(profile.email);
      if (user) {
        const updatedUser = await this.usersService.update(user.id, {
          googleId: profile.googleId,
        });
        if (updatedUser) {
          user = updatedUser;
        }
      } else {
        user = await this.usersService.create({
          email: profile.email,
          displayName: profile.displayName,
          googleId: profile.googleId,
        });
      }
    }
    return user;
  }

  generateTokens(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    };
  }
}
