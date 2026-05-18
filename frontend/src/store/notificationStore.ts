import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NotificationType = 'order' | 'promo' | 'delivery' | 'system' | 'payment'

export interface AppNotification {
  id: string
  title: string
  body: string
  type: NotificationType
  isRead: boolean
  createdAt: string
  emoji: string
  orderId?: string
  service?: string
}

interface NotificationStore {
  notifications: AppNotification[]
  addNotification: (n: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  remove: (id: string) => void
  clearAll: () => void
  getUnreadCount: () => number
}

const INITIAL: AppNotification[] = [
  { id: 'n1', title: 'Order Confirmed!', body: 'Your order from Spice Garden has been confirmed and is being prepared.', type: 'order', isRead: false, createdAt: new Date(Date.now() - 2 * 60000).toISOString(), emoji: '🍛', orderId: 'ORD-2024-002', service: 'food' },
  { id: 'n2', title: 'Out for Delivery', body: 'Your laundry from CleanPro is on its way! Estimated arrival: 30 mins.', type: 'delivery', isRead: false, createdAt: new Date(Date.now() - 15 * 60000).toISOString(), emoji: '🛵', orderId: 'ORD-2024-003', service: 'laundry' },
  { id: 'n3', title: '🎉 Weekend Sale!', body: 'Flat 20% off on all clothing orders this weekend. Use code: WEEKEND20', type: 'promo', isRead: false, createdAt: new Date(Date.now() - 60 * 60000).toISOString(), emoji: '🏷️', service: 'clothing' },
  { id: 'n4', title: 'Payment Successful', body: '₹2,898 paid via Razorpay UPI for your Urban Threads order.', type: 'payment', isRead: true, createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), emoji: '✅', orderId: 'ORD-2024-004' },
  { id: 'n5', title: 'Order Delivered!', body: 'Your Spice Garden order has been delivered. Enjoy your meal! 🍛', type: 'order', isRead: true, createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), emoji: '📦', orderId: 'ORD-2024-001', service: 'food' },
  { id: 'n6', title: 'Fresh Mangoes Available', body: "Alphonso mangoes are back in season at Fresh Farms! Limited stock.", type: 'promo', isRead: true, createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), emoji: '🥭', service: 'grocery' },
  { id: 'n7', title: 'Rate Your Experience', body: 'How was your Burger Barn order? Leave a review and get 50 points!', type: 'system', isRead: true, createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(), emoji: '⭐', orderId: 'ORD-2024-005' },
]

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: INITIAL,
      addNotification: (n) => set(s => ({
        notifications: [{ ...n, id: `n-${Date.now()}`, createdAt: new Date().toISOString(), isRead: false }, ...s.notifications]
      })),
      markRead: (id) => set(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, isRead: true } : n) })),
      markAllRead: () => set(s => ({ notifications: s.notifications.map(n => ({ ...n, isRead: true })) })),
      remove: (id) => set(s => ({ notifications: s.notifications.filter(n => n.id !== id) })),
      clearAll: () => set({ notifications: [] }),
      getUnreadCount: () => get().notifications.filter(n => !n.isRead).length,
    }),
    { name: 'swiftserve-notifications', skipHydration: true }
  )
)
