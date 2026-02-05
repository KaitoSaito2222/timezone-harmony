import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TimezonePresetsModule } from './modules/timezone-presets/timezone-presets.module';
import { TimezonesModule } from './modules/timezones/timezones.module';
import { CalendarModule } from './modules/calendar/calendar.module';
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
    CalendarModule,
  ],
})
export class AppModule {}
