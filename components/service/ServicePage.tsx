'use client'
import { useState, useMemo } from 'react'
import Topbar from '@/components/layout/Topbar'
import ProductCard from '@/components/product/ProductCard'
import { PRODUCTS, VENDORS } from '@/data'
import { svcColor } from '@/lib/utils'
import type { ServiceType } from '@/types'
import Link from 'next/link'
import { Star } from 'lucide-react'

const LABELS: Record<ServiceType,string> = { food:'Food Delivery', grocery:'Grocery', laundry:'Laundry', clothing:'Fashion' }
const HERO: Record<ServiceType, { h: string; p: string }> = {
  food:     { h:'Craving something?',     p:'Order from 240+ restaurants. Hot meals delivered in 30 minutes.' },
  grocery:  { h:'Fresh & Fast Delivery',  p:'5,000+ products from trusted farms and brands, delivered to your door.' },
  laundry:  { h:'Clothes in, fresh out',  p:'Schedule a pickup, we clean and deliver. Free pickup on every order.' },
  clothing: { h:'Dress to Impress',       p:'10,000+ styles from top brands. Free returns within 7 days.' },
}

export default function ServicePage({ service }: { service: ServiceType }) {
  const products = PRODUCTS[service] ?? []
  const vendors  = VENDORS[service]  ?? []
  const cats = ['All', ...Array.from(new Set(products.map(p => p.category)))]
  const [cat,  setCat]  = useState('All')
  const [sort, setSort] = useState('popular')
  const [veg,  setVeg]  = useState(false)

  const filtered = useMemo(() => {
    let list = cat === 'All' ? products : products.filter(p => p.category === cat)
    if (veg) list = list.filter(p => p.isVeg)
    if (sort === 'price-asc')  return [...list].sort((a,b) => a.price - b.price)
    if (sort === 'price-desc') return [...list].sort((a,b) => b.price - a.price)
    if (sort === 'rating')     return [...list].sort((a,b) => b.rating - a.rating)
    return list
  }, [cat, sort, veg, products])

  const sc = svcColor(service)
  const hero = HERO[service]

  return (
    <>
      <Topbar title={LABELS[service]} />
      <main style={{ padding:28 }}>
        {/* Hero */}
        <div style={{ borderRadius:24, padding:36, marginBottom:28, position:'relative', overflow:'hidden', background:`linear-gradient(135deg,${sc}20,${sc}06)` }}>
          <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 80% 50%,${sc}28 0%,transparent 65%)` }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <p style={{ fontSize:11, fontWeight:600, color:sc, textTransform:'uppercase', letterSpacing:2, marginBottom:8 }}>
              {service === 'food' ? '🍛' : service === 'grocery' ? '🛒' : service === 'laundry' ? '🧺' : '👗'} {LABELS[service]}
            </p>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:28, color:'#f0f0f8', marginBottom:8 }}>{hero.h}</h1>
            <p style={{ color:'#a0a0c0', fontSize:13, maxWidth:480 }}>{hero.p}</p>
          </div>
        </div>

        {/* Vendors */}
        <section style={{ marginBottom:28 }}>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'#f0f0f8', marginBottom:14 }}>Top Stores</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
            {vendors.map(v => (
              <div key={v.id} style={{ background:'#16161f', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, overflow:'hidden', cursor:'pointer' }}>
                <div style={{ height:80, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, background:v.color }}>{v.emoji}</div>
                <div style={{ padding:'12px 14px' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:13, color:'#f0f0f8' }}>{v.name}</span>
                    {v.isOpen
                      ? <span style={{ fontSize:10, color:'#00c896', fontWeight:600 }}>● Open</span>
                      : <span style={{ fontSize:10, color:'#ff5252', fontWeight:600 }}>Closed</span>}
                  </div>
                  <p style={{ fontSize:11, color:'#6060a0', marginBottom:8 }}>⭐ {v.rating} · {v.deliveryTime}</p>
                  <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                    {v.tags.slice(0,3).map(t => (
                      <span key={t} style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:'#1a1a26', color:'#a0a0c0', border:'1px solid rgba(255,255,255,0.07)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filters */}
        <div style={{ display:'flex', gap:8, marginBottom:14, overflowX:'auto', paddingBottom:4 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding:'7px 16px', borderRadius:30, fontSize:12, fontWeight:600, cursor:'pointer', border:`1px solid ${cat===c ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}`, background:cat===c ? '#22223a' : '#1a1a26', color:cat===c ? '#f0f0f8' : '#a0a0c0', whiteSpace:'nowrap', flexShrink:0 }}>
              {c}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:10, marginBottom:20, alignItems:'center' }}>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'8px 12px', color:'#f0f0f8', fontSize:12, outline:'none' }}>
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          {service === 'food' && (
            <button onClick={() => setVeg(v => !v)} style={{ padding:'8px 14px', borderRadius:10, fontSize:12, fontWeight:600, cursor:'pointer', border:`1px solid ${veg ? 'rgba(0,200,150,0.35)' : 'rgba(255,255,255,0.08)'}`, background:veg ? 'rgba(0,200,150,0.12)' : '#1a1a26', color:veg ? '#00c896' : '#a0a0c0' }}>
              🥬 Veg Only
            </button>
          )}
          <span style={{ fontSize:12, color:'#6060a0', marginLeft:'auto' }}>{filtered.length} items</span>
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'#6060a0' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:18, color:'#a0a0c0' }}>No items found</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
    </>
  )
}
