import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem(item: Omit<CartItem,'id'|'quantity'>, variant?: CartItem['variant']): void
  removeItem(id: string): void
  updateQty(id: string, qty: number): void
  clear(): void
  open(): void
  close(): void
  toggle(): void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem(itemData, variant) {
        const items = get().items
        const match = items.find(i =>
          i.productId === itemData.productId &&
          i.variant?.color === variant?.color &&
          i.variant?.size === variant?.size
        )
        if (match) {
          set({ items: items.map(i => i.id === match.id ? { ...i, quantity: i.quantity + 1 } : i) })
        } else {
          const newItem = { ...itemData, id: itemData.productId + '-' + Date.now(), quantity: 1, ...(variant ? { variant } : {}) }
          set({ items: [...items, newItem] })
        }
      },
      removeItem(id) { set(s => ({ items: s.items.filter(i => i.id !== id) })) },
      updateQty(id, qty) {
        if (qty <= 0) { get().removeItem(id); return }
        set(s => ({ items: s.items.map(i => i.id === id ? { ...i, quantity: qty } : i) }))
      },
      clear()  { set({ items: [] }) },
      open()   { set({ isOpen: true }) },
      close()  { set({ isOpen: false }) },
      toggle() { set(s => ({ isOpen: !s.isOpen })) },
    }),
    {
      name: 'ss-cart',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
)
