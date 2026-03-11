import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { ExportCalendarDto } from './dto/export-calendar.dto';

@Injectable()
export class CalendarService {
  generateICS(event: ExportCalendarDto): string {
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

    // Build ICS content as an array of lines, then join with CRLF as required by RFC 5545.
    // UID uniquely identifies the event; DTSTAMP is when this ICS was generated.
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

  // Escapes special characters per the iCalendar spec (RFC 5545).
  // Backslash first to avoid double-escaping; ; and , are delimiters; newlines become literal \n.
  private escapeICSText(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  }
}
