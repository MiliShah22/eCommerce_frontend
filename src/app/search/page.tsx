'use client'
import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'
import ProductCard from '@/components/product/ProductCard'
import { ALL_PRODUCTS, SERVICE_CONFIG } from '@/data'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { ServiceType } from '@/types'
import { Suspense } from 'react'

const SERVICE_TABS: Array<{ id: ServiceType | 'all'; label: string; emoji: string }> = [
  { id: 'all', label: 'All', emoji: '🔍' },
  { id: 'food', label: 'Food', emoji: '🍛' },
  { id: 'grocery', label: 'Grocery', emoji: '🛒' },
  { id: 'laundry', label: 'Laundry', emoji: '🧺' },
  { id: 'clothing', label: 'Clothing', emoji: '👗' },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const initial = searchParams.get('q') || ''
  const [query, setQuery] = useState(initial)
  const [service, setService] = useState<ServiceType | 'all'>('all')
  const [sort, setSort] = useState('relevant')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [vegOnly, setVegOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    let list = ALL_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.vendor.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    )
    if (service !== 'all') list = list.filter(p => p.service === service)
    if (vegOnly) list = list.filter(p => p.isVeg === true)
    list = list.filter(p => p.price <= maxPrice)
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    return list
  }, [query, service, sort, maxPrice, vegOnly])

  const grouped = SERVICE_TABS.slice(1).reduce((acc, tab) => {
    const items = results.filter(p => p.service === tab.id)
    if (items.length) acc[tab.id as ServiceType] = items
    return acc
  }, {} as Record<ServiceType, typeof results>)

  return (
    <>
      <Topbar title="Search" />
      <main className="p-7">
        <div className="mb-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 flex items-center gap-3 bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 focus-within:border-white/20 transition-colors">
              <Search size={16} className="text-text-3 flex-shrink-0" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search across all services…"
                className="flex-1 bg-transparent outline-none text-text text-sm placeholder-text-3" autoFocus />
              {query && <button onClick={() => setQuery('')}><X size={14} className="text-text-3 hover:text-text-2" /></button>}
            </div>
            <button onClick={() => setShowFilters(f => !f)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${showFilters ? 'bg-laundry/10 border-laundry/30 text-laundry' : 'bg-bg-3 border-white/[0.07] text-text-2 hover:border-white/20'}`}>
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-card border border-white/[0.07] rounded-2xl p-5 mb-4 grid grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Sort By</label>
                <select value={sort} onChange={e => setSort(e.target.value)}
                  className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-text outline-none">
                  <option value="relevant">Most Relevant</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Max Price: ₹{maxPrice}</label>
                <input type="range" min={100} max={5000} step={100} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-food" />
                <div className="flex justify-between text-[10px] text-text-3 mt-1"><span>₹100</span><span>₹5,000</span></div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Dietary</label>
                <button onClick={() => setVegOnly(v => !v)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all w-full justify-center ${vegOnly ? 'bg-grocery/10 border-grocery/30 text-grocery' : 'bg-bg-3 border-white/[0.07] text-text-2'}`}>
                  🥬 Veg Only
                </button>
              </div>
            </div>
          )}

          {/* Service filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {SERVICE_TABS.map(tab => (
              <button key={tab.id} onClick={() => setService(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${service === tab.id ? 'bg-bg-4 text-text border-white/25' : 'bg-bg-3 text-text-2 border-white/[0.07] hover:border-white/20'}`}>
                {tab.emoji} {tab.label}
                {tab.id !== 'all' && results.filter(p => p.service === tab.id).length > 0 && (
                  <span className="bg-bg-4 text-text-3 rounded-full px-1.5 py-0.5 text-[10px]">
                    {results.filter(p => p.service === tab.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {!query.trim() ? (
          <div className="text-center py-20 text-text-3">
            <Search size={52} className="mx-auto mb-4 opacity-30" />
            <p className="font-syne font-semibold text-xl text-text-2 mb-2">Search SwiftServe</p>
            <p className="text-sm">Find food, groceries, laundry services, and fashion</p>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {['Biryani', 'Organic', 'Polo T-Shirt', 'Dry Clean', 'Pizza', 'Mangoes'].map(s => (
                <button key={s} onClick={() => setQuery(s)}
                  className="px-3.5 py-2 rounded-full bg-bg-3 border border-white/[0.07] text-text-2 text-xs hover:border-white/20 hover:text-text transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 text-text-3">
            <div className="text-5xl mb-4">😕</div>
            <p className="font-syne font-semibold text-xl text-text-2 mb-2">No results for "{query}"</p>
            <p className="text-sm">Try different keywords or adjust your filters</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-text-2 mb-6"><span className="font-bold text-text">{results.length}</span> results for "<span className="text-food">{query}</span>"</p>
            {service === 'all' ? (
              <div className="space-y-8">
                {Object.entries(grouped).map(([svc, items]) => {
                  const cfg = SERVICE_CONFIG[svc as ServiceType]
                  return (
                    <div key={svc}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">{cfg.emoji}</span>
                        <h2 className="font-syne font-bold text-text">{cfg.label}</h2>
                        <span className="text-xs text-text-3 ml-1">{items.length} results</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {items.map(p => <ProductCard key={p.id} product={p} />)}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  )
}

export default function SearchPage() {
  return <Suspense fallback={<div className="p-7 text-text-3">Loading…</div>}><SearchContent /></Suspense>
}
