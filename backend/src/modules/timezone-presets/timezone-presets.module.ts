import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimezonePreset } from '../../entities/timezone-preset.entity';
import { PresetTimezone } from '../../entities/preset-timezone.entity';
import { TimezonePresetsService } from './timezone-presets.service';
import { TimezonePresetsController } from './timezone-presets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TimezonePreset, PresetTimezone])],
  controllers: [TimezonePresetsController],
  providers: [TimezonePresetsService],
  exports: [TimezonePresetsService],
})
export class TimezonePresetsModule {}
