import api from './api';
import type { AuthResponse, User } from '../types/auth.types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async register(
    email: string,
    password: string,
    displayName?: string
  ): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      displayName,
    });
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  getGoogleAuthUrl(): string {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    return `${apiUrl}/auth/google`;
  },
};
