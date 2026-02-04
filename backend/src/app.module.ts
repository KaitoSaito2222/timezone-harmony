import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TimezonePresetsModule } from './modules/timezone-presets/timezone-presets.module';
import { TimezonesModule } from './modules/timezones/timezones.module';
import { BusinessHoursModule } from './modules/business-hours/business-hours.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TimezonePresetsModule,
    TimezonesModule,
    BusinessHoursModule,
  ],
})
export class AppModule {}
