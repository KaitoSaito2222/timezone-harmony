import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { CalendarService } from './calendar.service';
import { ExportCalendarDto } from './dto/export-calendar.dto';

@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @ApiOperation({ summary: 'Export event as ICS file' })
  @Post('export')
  exportCalendar(@Body() dto: ExportCalendarDto, @Res() res: Response) {
    const icsContent = this.calendarService.generateICS(dto);

    const filename = `${dto.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(icsContent);
  }
}
