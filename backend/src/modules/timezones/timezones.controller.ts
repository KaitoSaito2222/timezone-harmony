import { Controller, Get, Query } from '@nestjs/common';
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

  @Get('current')
  getCurrentTimes(@Query('zones') zones: string) {
    const timezoneList = zones ? zones.split(',') : [];
    if (timezoneList.length === 0) {
      return [];
    }
    return this.timezonesService.getMultipleTimezonesTimes(timezoneList);
  }
}
