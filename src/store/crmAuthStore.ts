import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

interface CRMAuthState {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  userEmail: string | null;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'jhonrincon.marketer@gmail.com';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'CambiaEstaClave123!';

let authListenerInitialized = false;

const applySession = (set: (partial: Partial<CRMAuthState>) => void, session: Session | null) => {
  set({
    isAuthenticated: Boolean(session),
    userEmail: session?.user.email ?? null,
    isAuthLoading: false,
  });
};

export const useCRMAuthStore = create<CRMAuthState>((set) => ({
  isAuthenticated: false,
  isAuthLoading: true,
  userEmail: null,

  initializeAuth: async () => {
    if (!isSupabaseConfigured || !supabase) {
      set({ isAuthLoading: false });
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    applySession(set, session);

    if (!authListenerInitialized) {
      supabase.auth.onAuthStateChange((_event, nextSession) => {
        applySession(set, nextSession);
      });
      authListenerInitialized = true;
    }
  },

  login: async (email, password) => {
    console.log('Intento de login:', { email, isSupabaseConfigured, hasSupabase: !!supabase });
    
    if (!isSupabaseConfigured || !supabase) {
      console.log('Usando autenticación local. Config:', { ADMIN_EMAIL, ADMIN_PASSWORD });
      const normalizedEmail = email.trim().toLowerCase();
      const valid = normalizedEmail === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;
      if (!valid) {
        return { success: false, message: 'Credenciales incorrectas (modo local)' };
      }
      set({ isAuthenticated: true, userEmail: normalizedEmail });
      return { success: true };
    }

    console.log('Usando autenticación Supabase');
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      console.error('Error Supabase:', error);
      return { success: false, message: error.message };
    }
    console.log('Login exitoso con Supabase');
    return { success: true };
  },

  logout: async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    set({ isAuthenticated: false, userEmail: null });
  },
}));
