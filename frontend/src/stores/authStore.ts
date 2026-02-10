import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },

  register: async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    if (error) throw error;
  },

  loginWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  initialize: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        set({
          user: {
            id: u.id,
            email: u.email ?? '',
            displayName: u.user_metadata?.display_name ?? u.user_metadata?.full_name ?? null,
            role: 'user',
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const u = session.user;
          set({
            user: {
              id: u.id,
              email: u.email ?? '',
              displayName: u.user_metadata?.display_name ?? u.user_metadata?.full_name ?? null,
              role: 'user',
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    );

    return () => subscription.unsubscribe();
  },
}));
