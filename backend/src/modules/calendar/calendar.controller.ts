import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CalendarService } from './calendar.service';

class TimezoneInfoDto {
  @IsString()
  timezone: string;

  @IsString()
  localTime: string;
}

class ExportCalendarDto {
  @IsString()
  title: string;

  @IsString()
  startTime: string;

  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimezoneInfoDto)
  timezones?: TimezoneInfoDto[];
}

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('export')
  exportCalendar(@Body() dto: ExportCalendarDto, @Res() res: Response) {
    const icsContent = this.calendarService.generateICS(dto);

    const filename = `${dto.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(icsContent);
  }
}
