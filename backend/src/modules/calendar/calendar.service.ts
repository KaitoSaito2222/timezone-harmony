import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

interface CalendarEventDto {
  title: string;
  startTime: string; // ISO format
  duration: number; // minutes
  description?: string;
  timezones?: { timezone: string; localTime: string }[];
}

@Injectable()
export class CalendarService {
  generateICS(event: CalendarEventDto): string {
    const startTime = DateTime.fromISO(event.startTime);
    const endTime = startTime.plus({ minutes: event.duration });

    const formatICSDate = (dt: DateTime): string => {
      return dt.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    };

    // Build description with timezone info
    let description = event.description || 'Created with Timezone Harmony';
    if (event.timezones && event.timezones.length > 0) {
      description += '\\n\\nLocal times:\\n';
      description += event.timezones
        .map((tz) => `${tz.timezone}: ${tz.localTime}`)
        .join('\\n');
    }

    const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}@timezone-harmony`;

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Timezone Harmony//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatICSDate(DateTime.now())}`,
      `DTSTART:${formatICSDate(startTime)}`,
      `DTEND:${formatICSDate(endTime)}`,
      `SUMMARY:${this.escapeICSText(event.title)}`,
      `DESCRIPTION:${this.escapeICSText(description)}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  }

  private escapeICSText(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  }
}
