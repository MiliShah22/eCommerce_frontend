import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface WishlistStore {
  ids: string[]
  toggle(id: string): void
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: ['p3', 'c1', 'c3', 'g5'],
      toggle(id) {
        const ids = get().ids
        set({ ids: ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id] })
      },
    }),
    {
      name: 'ss-wish',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
)
