import { Module } from '@nestjs/common';
import { TimezonePresetsService } from './timezone-presets.service';
import { TimezonePresetsController } from './timezone-presets.controller';

@Module({
  controllers: [TimezonePresetsController],
  providers: [TimezonePresetsService],
  exports: [TimezonePresetsService],
})
export class TimezonePresetsModule {}
