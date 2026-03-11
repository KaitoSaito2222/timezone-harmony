import { Controller } from '@nestjs/common';

// Auth is handled entirely by Supabase; no dedicated endpoints needed here
@Controller('auth')
export class AuthController {}
