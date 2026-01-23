import api from './api';
import type { TimezonePreset } from '../types';

interface CreatePresetDto {
  name: string;
  description?: string;
  isFavorite?: boolean;
  timezones: {
    timezoneIdentifier: string;
    displayLabel?: string;
    position?: number;
  }[];
}

interface UpdatePresetDto {
  name?: string;
  description?: string;
  isFavorite?: boolean;
  timezones?: {
    timezoneIdentifier: string;
    displayLabel?: string;
    position?: number;
  }[];
}

export const presetService = {
  async getAll(): Promise<TimezonePreset[]> {
    const response = await api.get<TimezonePreset[]>('/presets');
    return response.data;
  },

  async getById(id: string): Promise<TimezonePreset> {
    const response = await api.get<TimezonePreset>(`/presets/${id}`);
    return response.data;
  },

  async create(data: CreatePresetDto): Promise<TimezonePreset> {
    const response = await api.post<TimezonePreset>('/presets', data);
    return response.data;
  },

  async update(id: string, data: UpdatePresetDto): Promise<TimezonePreset> {
    const response = await api.put<TimezonePreset>(`/presets/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/presets/${id}`);
  },

  async toggleFavorite(id: string): Promise<TimezonePreset> {
    const response = await api.post<TimezonePreset>(`/presets/${id}/favorite`);
    return response.data;
  },
};
