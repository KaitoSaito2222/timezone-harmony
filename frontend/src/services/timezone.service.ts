import api from './api';
import type { TimezoneInfo, CurrentTimeInfo } from '../types';

export const timezoneService = {
  async getAll(): Promise<TimezoneInfo[]> {
    const response = await api.get<TimezoneInfo[]>('/timezones');
    return response.data;
  },

  async getPopular(): Promise<TimezoneInfo[]> {
    const response = await api.get<TimezoneInfo[]>('/timezones/popular');
    return response.data;
  },

  async search(query: string): Promise<TimezoneInfo[]> {
    const response = await api.get<TimezoneInfo[]>('/timezones/search', {
      params: { q: query },
    });
    return response.data;
  },

  async getCurrentTimes(timezones: string[]): Promise<CurrentTimeInfo[]> {
    const response = await api.get<CurrentTimeInfo[]>('/timezones/current', {
      params: { zones: timezones.join(',') },
    });
    return response.data;
  },

  async convertTime(
    time: string,
    from: string,
    to: string
  ): Promise<string | null> {
    const response = await api.get<{ convertedTime?: string; error?: string }>(
      '/timezones/convert',
      { params: { time, from, to } }
    );
    return response.data.convertedTime || null;
  },
};
