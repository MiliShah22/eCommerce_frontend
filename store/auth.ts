import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthStore {
  user: User | null
  token: string | null
  login(user: User, token: string): void
  logout(): void
  update(partial: Partial<User>): void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login(user, token) { set({ user, token }) },
      logout()           { set({ user: null, token: null }) },
      update(partial)    { const u = get().user; if (u) set({ user: { ...u, ...partial } }) },
    }),
    {
      name: 'ss-auth',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
)
