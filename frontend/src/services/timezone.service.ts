import api from '@/services/api';
import type { TimezoneInfo } from '@/types/timezone.types';

export const timezoneService = {
  async getAll(): Promise<TimezoneInfo[]> {
    const response = await api.get<TimezoneInfo[]>('/timezones');
    return response.data;
  },

  async getPopular(): Promise<TimezoneInfo[]> {
    const response = await api.get<TimezoneInfo[]>('/timezones/popular');
    return response.data;
  },
};
