import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  productIds: string[]
  toggle: (productId: string) => void
  has: (productId: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: ['p3', 'c1', 'c3', 'g5'],
      toggle: (productId) => {
        const { productIds } = get()
        set({
          productIds: productIds.includes(productId)
            ? productIds.filter(id => id !== productId)
            : [...productIds, productId],
        })
      },
      has: (productId) => get().productIds.includes(productId),
      clear: () => set({ productIds: [] }),
    }),
    { name: 'swiftserve-wishlist', skipHydration: true }
  )
)
