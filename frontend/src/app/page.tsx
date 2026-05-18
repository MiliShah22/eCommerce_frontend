import Topbar from '@/components/layout/Topbar'
import ProductCard from '@/components/product/ProductCard'
import SectionHeader from '@/components/shared/SectionHeader'
import { PRODUCTS, ORDERS, SERVICE_CONFIG } from '@/data'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ServiceType } from '@/types'

const FEATURED = [
  PRODUCTS.food[0], PRODUCTS.food[2],
  PRODUCTS.grocery[4], PRODUCTS.clothing[2],
  PRODUCTS.laundry[0], PRODUCTS.clothing[0],
]

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25',
  confirmed: 'bg-green-500/15 text-green-400 border border-green-500/25',
  preparing: 'bg-orange-500/15 text-orange-400 border border-orange-500/25',
  delivered: 'bg-purple-500/15 text-purple-400 border border-purple-500/25',
}

export default function HomePage() {
  return (
    <>
      <Topbar title="SwiftServe" />
      <main className="p-7 animate-fade-up">
        {/* Hero */}
        <div className="relative rounded-[28px] p-10 mb-8 overflow-hidden min-h-[210px] flex flex-col justify-end"
          style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,77,158,0.08), rgba(124,111,255,0.1))' }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 75% 50%, rgba(255,107,53,0.2) 0%, transparent 60%)' }} />
          <div className="relative z-10">
            <p className="text-xs font-semibold text-food mb-2 tracking-widest uppercase">📍 Vadodara, Gujarat</p>
            <h1 className="font-syne font-black text-4xl text-text leading-tight mb-3">
              Everything, Delivered<br /><span className="text-food">to your door</span>
            </h1>
            <p className="text-text-2 text-sm max-w-md">Food, groceries, laundry, and fashion — one app, one checkout, zero hassle.</p>
            <div className="flex gap-3 mt-5">
              <Link href="/food" className="px-5 py-2.5 rounded-xl bg-food text-white text-sm font-semibold flex items-center gap-2 hover:brightness-110 transition-all">🍛 Order Food</Link>
              <Link href="/grocery" className="px-5 py-2.5 rounded-xl bg-white/[0.07] text-text text-sm font-semibold border border-white/[0.12] flex items-center gap-2 hover:bg-white/[0.12] transition-all">🛒 Shop Groceries</Link>
            </div>
          </div>
        </div>

        {/* Services */}
        <section className="mb-8">
          <SectionHeader title="Our Services" />
          <div className="grid grid-cols-4 gap-4">
            {(Object.keys(SERVICE_CONFIG) as ServiceType[]).map(service => {
              const cfg = SERVICE_CONFIG[service]
              return (
                <Link key={service} href={`/${service}`}
                  className="relative rounded-2xl p-6 cursor-pointer border transition-all duration-200 hover:-translate-y-1 group overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${cfg.color}22, ${cfg.color}08)`, borderColor: `${cfg.color}30` }}>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0">
                    <ArrowRight size={15} style={{ color: cfg.color }} />
                  </div>
                  <span className="text-4xl block mb-4">{cfg.emoji}</span>
                  <h3 className="font-syne font-bold text-lg mb-1.5" style={{ color: cfg.color }}>{cfg.label}</h3>
                  <p className="text-text-2 text-xs leading-relaxed">{cfg.description}</p>
                  <p className="text-text-3 text-xs mt-3">{cfg.stat}</p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Featured */}
        <section className="mb-8">
          <SectionHeader title="Featured Right Now" viewAllHref="/food" />
          <div className="grid grid-cols-3 xl:grid-cols-6 gap-4">
            {FEATURED.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* Recent Orders */}
        <section>
          <SectionHeader title="📦 Recent Orders" viewAllHref="/orders" />
          <div className="flex flex-col gap-3">
            {ORDERS.slice(0, 2).map(o => (
              <Link key={o.id} href={`/orders/${o.id}`}
                className="flex items-center gap-4 p-4 bg-card border border-white/[0.07] rounded-2xl hover:border-white/[0.12] transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-bg-3">{o.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-syne font-bold text-text text-sm">{o.vendor}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${STATUS_STYLES[o.status] || STATUS_STYLES.pending}`}>{o.status}</span>
                  </div>
                  <p className="text-xs text-text-2 truncate">{o.items.join(' · ')}</p>
                  <p className="text-xs text-text-3 mt-0.5">{o.date} · #{o.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-syne font-bold text-text">₹{o.total}</p>
                  <p className="text-xs text-text-3 mt-1">{o.items.length} items</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
