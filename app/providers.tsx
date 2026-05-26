'use client'
import { useEffect } from 'react'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { useNotifs } from '@/store/notifications'
import { useAuth } from '@/store/auth'

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Rehydrate persisted stores after mount to avoid SSR mismatch
    useCart.persist.rehydrate()
    useWishlist.persist.rehydrate()
    useNotifs.persist.rehydrate()
    useAuth.persist.rehydrate()
  }, [])
  return <>{children}</>
}
