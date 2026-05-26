'use client'
import Topbar from '@/components/layout/Topbar'
import ProductCard from '@/components/product/ProductCard'
import Link from 'next/link'
import { PRODUCTS, ORDERS, SVC } from '@/data'
import { statusStyle, svcColor } from '@/lib/utils'
import type { ServiceType } from '@/types'
import { ArrowRight } from 'lucide-react'

const FEATURED = [
  PRODUCTS.food[0], PRODUCTS.food[2], PRODUCTS.grocery[4],
  PRODUCTS.clothing[2], PRODUCTS.laundry[0], PRODUCTS.clothing[0],
]

export default function HomePage() {
  const card: React.CSSProperties = { background:'#16161f', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:16 }

  return (
    <>
      <Topbar title="SwiftServe" />
      <main style={{ padding:28 }}>
        {/* Hero */}
        <div style={{ borderRadius:28, padding:40, marginBottom:28, minHeight:200, display:'flex', flexDirection:'column', justifyContent:'flex-end', position:'relative', background:'linear-gradient(135deg,rgba(255,107,53,.15),rgba(255,77,158,.08),rgba(124,111,255,.1))' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 75% 50%,rgba(255,107,53,.2) 0%,transparent 60%)' }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <p style={{ fontSize:12, fontWeight:600, color:'#ff6b35', marginBottom:8, textTransform:'uppercase', letterSpacing:2 }}>📍 Vadodara, Gujarat</p>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:36, lineHeight:1.2, margin:'0 0 10px', color:'#f0f0f8' }}>
              Everything, Delivered<br /><span style={{ color:'#ff6b35' }}>to your door</span>
            </h1>
            <p style={{ color:'#a0a0c0', fontSize:14, maxWidth:420 }}>Food, groceries, laundry, and fashion — one app, one checkout.</p>
            <div style={{ display:'flex', gap:12, marginTop:20 }}>
              <Link href="/food" style={{ padding:'10px 20px', borderRadius:12, background:'#ff6b35', color:'#fff', fontWeight:600, fontSize:14, textDecoration:'none' }}>🍛 Order Food</Link>
              <Link href="/grocery" style={{ padding:'10px 20px', borderRadius:12, background:'rgba(255,255,255,0.08)', color:'#f0f0f8', fontWeight:600, fontSize:14, border:'1px solid rgba(255,255,255,0.12)', textDecoration:'none' }}>🛒 Shop Groceries</Link>
            </div>
          </div>
        </div>

        {/* Services */}
        <section style={{ marginBottom:32 }}>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:18, marginBottom:16, color:'#f0f0f8' }}>Our Services</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {(Object.keys(SVC) as ServiceType[]).map(s => (
              <Link key={s} href={`/${s}`} style={{ textDecoration:'none', borderRadius:20, padding:'24px 20px', border:`1px solid ${svcColor(s)}35`, background:`linear-gradient(135deg,${svcColor(s)}20,${svcColor(s)}06)`, display:'block' }}>
                <div style={{ fontSize:36, marginBottom:14 }}>{SVC[s].emoji}</div>
                <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:svcColor(s), marginBottom:6 }}>{SVC[s].label}</h3>
                <p style={{ fontSize:12, color:'#a0a0c0', lineHeight:1.5 }}>{SVC[s].desc}</p>
                <p style={{ fontSize:11, color:'#6060a0', marginTop:10 }}>{SVC[s].stat}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section style={{ marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:18, color:'#f0f0f8' }}>Featured Right Now</h2>
            <Link href="/food" style={{ fontSize:13, color:'#6060a0', display:'flex', alignItems:'center', gap:4, textDecoration:'none' }}>View all <ArrowRight size={12} /></Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:14 }}>
            {FEATURED.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* Recent Orders */}
        <section>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:18, color:'#f0f0f8' }}>📦 Recent Orders</h2>
            <Link href="/orders" style={{ fontSize:13, color:'#6060a0', textDecoration:'none' }}>View all →</Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {ORDERS.slice(0,2).map(o => (
              <Link key={o.id} href={`/orders/${o.id}`} style={{ display:'flex', alignItems:'center', gap:16, padding:16, background:'#16161f', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, textDecoration:'none' }}>
                <div style={{ width:48, height:48, borderRadius:14, background:'#1a1a26', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{o.emoji}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14, color:'#f0f0f8' }}>{o.vendor}</span>
                    <OrderStatusBadge status={o.status} />
                  </div>
                  <p style={{ fontSize:12, color:'#a0a0c0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.items.join(' · ')}</p>
                  <p style={{ fontSize:11, color:'#6060a0', marginTop:2 }}>{o.date}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:svcColor(o.service) }}>₹{o.total}</div>
                  <div style={{ fontSize:11, color:'#6060a0', marginTop:2 }}>{o.items.length} items</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    pending:          { bg:'rgba(245,200,66,.15)',  color:'#f5c842' },
    confirmed:        { bg:'rgba(0,200,150,.15)',   color:'#00c896' },
    preparing:        { bg:'rgba(255,107,53,.15)',  color:'#ff6b35' },
    out_for_delivery: { bg:'rgba(96,96,255,.15)',   color:'#7c6fff' },
    delivered:        { bg:'rgba(124,111,255,.15)', color:'#7c6fff' },
    cancelled:        { bg:'rgba(255,82,82,.15)',   color:'#ff5252' },
  }
  const s = styles[status] ?? styles.pending
  return (
    <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20, background:s.bg, color:s.color, textTransform:'uppercase', letterSpacing:.3 }}>
      {status.replace('_',' ')}
    </span>
  )
}
