import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TimezonesService } from './timezones.service';
import { TimezoneInfo } from './dto/timezone-info.dto';

@ApiTags('timezones')
@Controller('timezones')
export class TimezonesController {
  constructor(private readonly timezonesService: TimezonesService) {}

  @ApiOperation({ summary: 'Get all timezones' })
  @Get()
  getAllTimezones(): TimezoneInfo[] {
    return this.timezonesService.getAllTimezones();
  }

  @ApiOperation({ summary: 'Get popular timezones' })
  @Get('popular')
  getPopularTimezones(): TimezoneInfo[] {
    return this.timezonesService.getPopularTimezones();
  }
}
