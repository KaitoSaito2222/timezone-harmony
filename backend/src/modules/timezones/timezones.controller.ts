import { Controller, Get } from '@nestjs/common';
import { TimezonesService, TimezoneInfo } from './timezones.service';

@Controller('timezones')
export class TimezonesController {
  constructor(private readonly timezonesService: TimezonesService) {}

  @Get()
  getAllTimezones(): TimezoneInfo[] {
    return this.timezonesService.getAllTimezones();
  }

  @Get('popular')
  getPopularTimezones(): TimezoneInfo[] {
    return this.timezonesService.getPopularTimezones();
  }
}
