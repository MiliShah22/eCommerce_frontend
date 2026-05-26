import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Notification } from '@/types'
import { NOTIFICATIONS } from '@/data'

interface NotifStore {
  items: Notification[]
  markRead(id: string): void
  markAll(): void
  remove(id: string): void
  clear(): void
}

export const useNotifs = create<NotifStore>()(
  persist(
    (set) => ({
      items: NOTIFICATIONS,
      markRead(id) { set(s => ({ items: s.items.map(n => n.id === id ? { ...n, isRead: true } : n) })) },
      markAll()    { set(s => ({ items: s.items.map(n => ({ ...n, isRead: true })) })) },
      remove(id)   { set(s => ({ items: s.items.filter(n => n.id !== id) })) },
      clear()      { set({ items: [] }) },
    }),
    {
      name: 'ss-notifs',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
)
