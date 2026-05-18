import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, ServiceType } from '@/types'
import toast from 'react-hot-toast'

interface CartStore {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>, variant?: CartItem['variant']) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Computed (via selectors)
  getCount: () => number
  getSubtotal: () => number
  getDeliveryFee: () => number
  getTax: () => number
  getTotal: () => number
  getItemById: (productId: string) => CartItem | undefined
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (itemData, variant) => {
        const items = get().items
        const existingKey = variant
          ? items.find(i => i.productId === itemData.productId && i.variant?.color === variant.color && i.variant?.size === variant.size)
          : items.find(i => i.productId === itemData.productId && !i.variant)

        if (existingKey) {
          set(state => ({
            items: state.items.map(i =>
              i.id === existingKey.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }))
        } else {
          const newItem: CartItem = {
            ...itemData,
            id: `${itemData.productId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            quantity: 1,
            ...(variant && { variant }),
          }
          set(state => ({ items: [...state.items, newItem] }))
        }
      },

      removeItem: (itemId) => {
        set(state => ({ items: state.items.filter(i => i.id !== itemId) }))
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set(state => ({
          items: state.items.map(i => (i.id === itemId ? { ...i, quantity } : i)),
        }))
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set(s => ({ isOpen: !s.isOpen })),

      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getDeliveryFee: () => (get().items.length > 0 ? 40 : 0),
      getTax: () => Math.round(get().getSubtotal() * 0.05),
      getTotal: () => get().getSubtotal() + get().getDeliveryFee() + get().getTax(),
      getItemById: (productId) => get().items.find(i => i.productId === productId),
    }),
    { name: 'swiftserve-cart', skipHydration: true }
  )
)
