'use client'
import { useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useNotificationStore } from '@/store/notificationStore'
import { useAuthStore } from '@/store/authStore'

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCartStore.persist.rehydrate()
    useWishlistStore.persist.rehydrate()
    useNotificationStore.persist.rehydrate()
    useAuthStore.persist.rehydrate()
  }, [])
  return <>{children}</>
}
