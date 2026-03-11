import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Apply with @UseGuards(JwtAuthGuard) to protect endpoints
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
