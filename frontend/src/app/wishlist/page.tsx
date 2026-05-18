'use client'
import Topbar from '@/components/layout/Topbar'
import ProductCard from '@/components/product/ProductCard'
import { ALL_PRODUCTS } from '@/data'
import { useWishlistStore } from '@/store/wishlistStore'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function WishlistPage() {
  const { productIds, clear } = useWishlistStore()
  const items = ALL_PRODUCTS.filter(p => productIds.includes(p.id))

  const byService = items.reduce((acc, p) => {
    acc[p.service] = [...(acc[p.service] || []), p]
    return acc
  }, {} as Record<string, typeof items>)

  const serviceLabels: Record<string, string> = { food:'🍛 Food', grocery:'🛒 Grocery', laundry:'🧺 Laundry', clothing:'👗 Fashion' }

  return (
    <>
      <Topbar title="My Wishlist" />
      <main className="p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-syne font-black text-2xl text-text">My Wishlist</h1>
            <p className="text-text-3 text-sm mt-1">{items.length} saved {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          {items.length > 0 && (
            <button onClick={clear} className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 transition-all">
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-bg-3 flex items-center justify-center mb-4">
              <Heart size={36} className="text-text-3" />
            </div>
            <h2 className="font-syne font-bold text-xl text-text-2 mb-2">Your wishlist is empty</h2>
            <p className="text-text-3 text-sm mb-6">Browse our services and save the items you love</p>
            <Link href="/" className="px-6 py-3 rounded-xl bg-clothing text-white font-semibold text-sm hover:brightness-110 transition-all">
              Start Browsing
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(byService).map(([service, products]) => (
              <section key={service}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-syne font-bold text-lg text-text">{serviceLabels[service]}</h2>
                  <Link href={`/${service}`} className="text-xs text-text-3 hover:text-text-2 transition-colors flex items-center gap-1">
                    Browse more →
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
