import api from '@/services/api';

interface TimezoneInfo {
  timezone: string;
  localTime: string;
}

interface ExportCalendarDto {
  title: string;
  startTime: string;
  duration: number;
  description?: string;
  timezones?: TimezoneInfo[];
}

export const calendarService = {
  async exportToICS(data: ExportCalendarDto): Promise<Blob> {
    const response = await api.post('/calendar/export', data, {
      responseType: 'blob',
    });
    return response.data;
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
