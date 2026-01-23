import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  setToken: (token: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(email, password);
          localStorage.setItem('token', response.accessToken);
          set({
            token: response.accessToken,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, displayName?: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(email, password, displayName);
          localStorage.setItem('token', response.accessToken);
          set({
            token: response.accessToken,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      setToken: async (token: string) => {
        localStorage.setItem('token', token);
        set({ token, isLoading: true });
        try {
          const user = await authService.getProfile();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          localStorage.removeItem('token');
          set({ token: null, user: null, isAuthenticated: false, isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false });
      },

      loadUser: async () => {
        const token = get().token || localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authService.getProfile();
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch {
          localStorage.removeItem('token');
          set({ token: null, user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
