import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CRMAuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'jhonrincon.marketer@gmail.com';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'CambiaEstaClave123!';

export const useCRMAuthStore = create<CRMAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const valid = normalizedEmail === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;
        if (valid) {
          set({ isAuthenticated: true });
        }
        return valid;
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'crm-auth-storage',
    }
  )
);
