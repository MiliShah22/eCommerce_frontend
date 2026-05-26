'use client'
import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'
import ProductCard from '@/components/product/ProductCard'
import { ALL_PRODUCTS, SVC } from '@/data'
import { svcColor } from '@/lib/utils'
import type { ServiceType } from '@/types'
import { Search, SlidersHorizontal, X } from 'lucide-react'

const SERVICES: Array<{ id: ServiceType | 'all'; label: string; emoji: string }> = [
  { id:'all', label:'All', emoji:'🔍' },
  { id:'food', label:'Food', emoji:'🍛' },
  { id:'grocery', label:'Grocery', emoji:'🛒' },
  { id:'laundry', label:'Laundry', emoji:'🧺' },
  { id:'clothing', label:'Clothing', emoji:'👗' },
]

function SearchContent() {
  const sp = useSearchParams()
  const [q, setQ] = useState(sp.get('q') || '')
  const [svc, setSvc] = useState<ServiceType | 'all'>('all')
  const [sort, setSort] = useState('relevant')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [veg, setVeg] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const results = useMemo(() => {
    if (!q.trim()) return []
    const lq = q.toLowerCase()
    let list = ALL_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(lq) ||
      p.category.toLowerCase().includes(lq) ||
      p.vendor.toLowerCase().includes(lq) ||
      p.description?.toLowerCase().includes(lq)
    )
    if (svc !== 'all') list = list.filter(p => p.service === svc)
    if (veg) list = list.filter(p => p.isVeg === true)
    list = list.filter(p => p.price <= maxPrice)
    if (sort === 'price-asc')  list = [...list].sort((a,b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a,b) => b.price - a.price)
    if (sort === 'rating')     list = [...list].sort((a,b) => b.rating - a.rating)
    return list
  }, [q, svc, sort, maxPrice, veg])

  const inp: React.CSSProperties = { background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 14px', color:'#f0f0f8', fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif' }

  return (
    <>
      <Topbar title="Search" />
      <main style={{ padding:28 }}>
        {/* Search bar */}
        <div style={{ display:'flex', gap:10, marginBottom:16 }}>
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:10, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, padding:'10px 16px' }}>
            <Search size={15} style={{ color:'#6060a0', flexShrink:0 }} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search food, grocery, fashion, laundry…" autoFocus
              style={{ flex:1, background:'none', border:'none', outline:'none', color:'#f0f0f8', fontSize:14, fontFamily:'DM Sans,sans-serif' }} />
            {q && <button onClick={() => setQ('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#6060a0', padding:0 }}><X size={14} /></button>}
          </div>
          <button onClick={() => setShowFilters(f => !f)} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 16px', borderRadius:14, border:`1px solid ${showFilters ? 'rgba(124,111,255,0.4)' : 'rgba(255,255,255,0.08)'}`, background:showFilters ? 'rgba(124,111,255,0.1)' : '#1a1a26', color:showFilters ? '#7c6fff' : '#a0a0c0', fontSize:13, fontWeight:600, cursor:'pointer' }}>
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div style={{ background:'#16161f', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18, padding:20, marginBottom:16, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:'#a0a0c0', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>Sort By</label>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...inp, width:'100%' }}>
                <option value="relevant">Most Relevant</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:'#a0a0c0', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>Max Price: ₹{maxPrice}</label>
              <input type="range" min={100} max={5000} step={100} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width:'100%', accentColor:'#ff6b35' }} />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'#6060a0', marginTop:4 }}><span>₹100</span><span>₹5,000</span></div>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:'#a0a0c0', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>Dietary</label>
              <button onClick={() => setVeg(v => !v)} style={{ width:'100%', padding:'10px', borderRadius:10, border:`1px solid ${veg ? 'rgba(0,200,150,0.35)' : 'rgba(255,255,255,0.08)'}`, background:veg ? 'rgba(0,200,150,0.1)' : '#1a1a26', color:veg ? '#00c896' : '#a0a0c0', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                🥬 Veg Only
              </button>
            </div>
          </div>
        )}

        {/* Service tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
          {SERVICES.map(t => (
            <button key={t.id} onClick={() => setSvc(t.id)} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:30, fontSize:12, fontWeight:600, cursor:'pointer', border:`1px solid ${svc===t.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}`, background:svc===t.id ? '#22223a' : '#1a1a26', color:svc===t.id ? '#f0f0f8' : '#a0a0c0' }}>
              {t.emoji} {t.label}
              {t.id !== 'all' && q && (
                <span style={{ background:'#2e2e4e', borderRadius:20, padding:'1px 6px', fontSize:10, color:'#a0a0c0' }}>
                  {ALL_PRODUCTS.filter(p => p.service === t.id && p.name.toLowerCase().includes(q.toLowerCase())).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Results */}
        {!q.trim() ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'#6060a0' }}>
            <Search size={52} style={{ margin:'0 auto 16px', opacity:.3 }} />
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:20, color:'#a0a0c0', fontWeight:600, marginBottom:8 }}>Search SwiftServe</p>
            <p style={{ fontSize:13, marginBottom:20 }}>Find food, groceries, laundry services, and fashion</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
              {['Biryani','Organic','Polo T-Shirt','Dry Clean','Pizza','Mangoes'].map(s => (
                <button key={s} onClick={() => setQ(s)} style={{ padding:'7px 16px', borderRadius:30, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', color:'#a0a0c0', fontSize:12, cursor:'pointer' }}>{s}</button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'#6060a0' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>😕</div>
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:18, color:'#a0a0c0', marginBottom:6 }}>No results for "{q}"</p>
            <p style={{ fontSize:13 }}>Try different keywords or adjust filters</p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize:13, color:'#a0a0c0', marginBottom:20 }}><strong style={{ color:'#f0f0f8' }}>{results.length}</strong> results for "<span style={{ color:'#ff6b35' }}>{q}</span>"</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16 }}>
              {results.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default function SearchPage() {
  return <Suspense fallback={<div style={{ padding:28, color:'#6060a0' }}>Loading…</div>}><SearchContent /></Suspense>
}
