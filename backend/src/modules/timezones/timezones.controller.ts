import { Controller, Get, Query, Param } from '@nestjs/common';
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

  @Get('search')
  searchTimezones(@Query('q') query: string): TimezoneInfo[] {
    if (!query || query.length < 2) {
      return [];
    }
    return this.timezonesService.searchTimezones(query);
  }

  @Get('convert')
  convertTime(
    @Query('time') time: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const converted = this.timezonesService.convertTime(time, from, to);
    if (!converted) {
      return { error: 'Invalid timezone or time format' };
    }
    return { convertedTime: converted };
  }

  @Get('current')
  getCurrentTimes(@Query('zones') zones: string) {
    const timezoneList = zones ? zones.split(',') : [];
    if (timezoneList.length === 0) {
      return [];
    }
    return this.timezonesService.getMultipleTimezonesTimes(timezoneList);
  }

  @Get(':identifier')
  getTimezoneInfo(@Param('identifier') identifier: string): TimezoneInfo | { error: string } {
    const decodedIdentifier = decodeURIComponent(identifier);
    const info = this.timezonesService.getTimezoneInfo(decodedIdentifier);
    if (!info) {
      return { error: 'Timezone not found' };
    }
    return info;
  }
}
