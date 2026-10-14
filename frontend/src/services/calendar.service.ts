import { DateTime } from 'luxon';

interface TimezoneInfo {
  timezone: string;
  localTime: string;
}

interface ExportCalendarInput {
  title: string;
  startTime: string;
  duration: number;
  description?: string;
  timezones?: TimezoneInfo[];
}

// Escapes special characters per the iCalendar spec (RFC 5545).
// Backslash first to avoid double-escaping; ; and , are delimiters; line breaks become literal \n.
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

function formatICSDate(dt: DateTime): string {
  return dt.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
}

export const calendarService = {
  exportToICS(event: ExportCalendarInput): Blob {
    const startTime = DateTime.fromISO(event.startTime);
    const endTime = startTime.plus({ minutes: event.duration });

    // Build description with timezone info
    let description = event.description || 'Created with Timezone Harmony';
    if (event.timezones && event.timezones.length > 0) {
      // Real line breaks here; escapeICSText turns them into the \n escape.
      description += '\n\nLocal times:\n';
      description += event.timezones.map((tz) => `${tz.timezone}: ${tz.localTime}`).join('\n');
    }

    const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}@timezone-harmony`;

    // Lines joined with CRLF as required by RFC 5545.
    // UID uniquely identifies the event; DTSTAMP is when this ICS was generated.
    const ics = [
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
      `SUMMARY:${escapeICSText(event.title)}`,
      `DESCRIPTION:${escapeICSText(description)}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    return new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  },

  downloadICS(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
