'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, ShoppingBag, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { ALL_PRODUCTS, SERVICE_CONFIG } from '@/data'
import NotificationBell from '@/components/notifications/NotificationBell'
import type { ServiceType } from '@/types'

const SVC_COLORS: Record<ServiceType, string> = { food: '#ff6b35', grocery: '#00c896', laundry: '#7c6fff', clothing: '#ff4d9e' }

export default function Topbar({ title }: { title?: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<typeof ALL_PRODUCTS>([])
  const [focused, setFocused] = useState(false)
  const router = useRouter()
  const { getCount, toggleCart } = useCartStore()
  const count = getCount()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    setResults(ALL_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.vendor.toLowerCase().includes(q)
    ).slice(0, 7))
  }, [query])

  return (
    <header className="h-[62px] bg-bg-2 border-b border-white/[0.07] flex items-center gap-4 px-6 sticky top-0 z-30">
      <span className="font-syne font-bold text-lg text-text mr-2 hidden sm:block">{title || 'SwiftServe'}</span>
      <div className="flex-1" />

      {/* Search */}
      <div className="relative" ref={ref}>
        <div className={`flex items-center gap-2.5 bg-bg-3 border rounded-xl px-3.5 py-2.5 w-72 transition-all ${focused ? 'border-white/20 bg-bg-4' : 'border-white/[0.07]'}`}>
          <Search size={14} className="text-text-3 flex-shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 180)}
            onKeyDown={e => { if (e.key === 'Enter' && query.trim()) { router.push(`/search?q=${encodeURIComponent(query)}`); setQuery(''); setFocused(false) } }}
            placeholder="Search food, grocery, fashion…"
            className="bg-transparent border-none outline-none text-text text-sm placeholder-text-3 w-full"
          />
          {query && <button onClick={() => setQuery('')} tabIndex={-1}><X size={13} className="text-text-3 hover:text-text-2" /></button>}
        </div>

        {/* Dropdown results */}
        {focused && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card-2 border border-white/[0.07] rounded-2xl shadow-2xl overflow-hidden z-50">
            {results.map(p => (
              <button key={p.id}
                onMouseDown={() => { router.push(`/product/${p.id}`); setQuery('') }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-3/70 transition-colors text-left">
                <span className="text-xl w-8 text-center">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{p.name}</p>
                  <p className="text-xs text-text-3">{p.vendor} · {SERVICE_CONFIG[p.service].label}</p>
                </div>
                <span className="text-sm font-bold font-syne flex-shrink-0" style={{ color: SVC_COLORS[p.service] }}>₹{p.price}</span>
              </button>
            ))}
            <button onMouseDown={() => { router.push(`/search?q=${encodeURIComponent(query)}`); setQuery('') }}
              className="w-full px-4 py-2.5 text-xs text-text-3 hover:text-laundry border-t border-white/[0.05] transition-colors text-center">
              See all results for "{query}" →
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <NotificationBell />
        <button onClick={toggleCart}
          className="relative w-9 h-9 rounded-xl bg-bg-3 border border-white/[0.07] flex items-center justify-center text-text-2 hover:text-text hover:bg-bg-4 transition-all">
          <ShoppingBag size={16} />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-food text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-bg-2">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </button>
        <Link href="/profile">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-laundry to-clothing flex items-center justify-center font-syne font-bold text-white text-sm cursor-pointer hover:scale-105 transition-transform">
            JD
          </div>
        </Link>
      </div>
    </header>
  )
}
