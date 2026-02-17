import api from '@/services/api';
import type { User } from '@/types/auth.types';

export const authService = {
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
};
