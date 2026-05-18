'use client'
import { useState, useMemo } from 'react'
import Topbar from '@/components/layout/Topbar'
import ServiceHero from '@/components/shared/ServiceHero'
import SectionHeader from '@/components/shared/SectionHeader'
import ProductCard from '@/components/product/ProductCard'
import VendorCard from '@/components/shared/VendorCard'
import { PRODUCTS, VENDORS } from '@/data'
import type { ServiceType } from '@/types'

const SERVICE_LABELS: Record<ServiceType, string> = {
  food: 'Food Delivery', grocery: 'Grocery', laundry: 'Laundry', clothing: 'Fashion'
}

export default function ServicePage({ service }: { service: ServiceType }) {
  const products = PRODUCTS[service] || []
  const vendors = VENDORS[service] || []
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))]
  const [activeCategory, setActiveCategory] = useState('All')
  const [sort, setSort] = useState('popular')
  const [vegOnly, setVegOnly] = useState(false)

  const filtered = useMemo(() => {
    let list = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory)
    if (vegOnly && service === 'food') list = list.filter(p => p.isVeg)
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [activeCategory, sort, vegOnly, products, service])

  return (
    <>
      <Topbar title={SERVICE_LABELS[service]} />
      <main className="p-7">
        <ServiceHero service={service} />
        {/* Vendors */}
        <section className="mb-8">
          <SectionHeader title="Top Stores" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {vendors.map(v => <VendorCard key={v.id} vendor={v} />)}
          </div>
        </section>
        {/* Filters */}
        <section>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat ? 'bg-bg-4 text-text border-white/20' : 'bg-bg-3 text-text-2 border-white/[0.07] hover:border-white/[0.12]'
                }`}>{cat}</button>
            ))}
          </div>
          <div className="flex items-center gap-3 mb-5">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="bg-bg-3 border border-white/[0.07] rounded-xl px-3 py-2 text-text text-xs outline-none hover:border-white/20 transition-colors">
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            {service === 'food' && (
              <button onClick={() => setVegOnly(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  vegOnly ? 'bg-grocery/15 text-grocery border-grocery/30' : 'bg-bg-3 text-text-2 border-white/[0.07] hover:border-white/20'
                }`}>
                🥬 Veg Only
              </button>
            )}
          </div>
          <SectionHeader title={`All ${SERVICE_LABELS[service]} Items`} count={filtered.length} />
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-text-3">
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-lg font-syne font-semibold text-text-2">No items found</p>
              <p className="text-sm mt-1">Try a different filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
