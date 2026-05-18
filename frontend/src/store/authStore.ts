import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'VENDOR' | 'ADMIN';
  joined: string;
  avatar?: string;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 98765 43210',
        role: 'USER',
        joined: 'Jan 2024',
      },
      isAuthenticated: true,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) =>
        set((s) => ({ user: s.user ? { ...s.user, ...data } : s.user })),
    }),
    { name: 'swiftserve-auth' }
  )
);
