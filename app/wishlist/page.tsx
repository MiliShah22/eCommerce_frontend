'use client'
import Topbar from '@/components/layout/Topbar'
import ProductCard from '@/components/product/ProductCard'
import { ALL_PRODUCTS, SVC } from '@/data'
import { useWishlist } from '@/store/wishlist'
import type { ServiceType } from '@/types'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function WishlistPage() {
  const ids = useWishlist(s => s.ids)
  const toggle = useWishlist(s => s.toggle)
  const clear = () => { ids.forEach(id => toggle(id)) }
  const items = ALL_PRODUCTS.filter(p => ids.includes(p.id))
  const grouped = items.reduce((acc, p) => {
    acc[p.service] = [...(acc[p.service] || []), p]; return acc
  }, {} as Record<ServiceType, typeof items>)

  return (
    <>
      <Topbar title="My Wishlist" />
      <main style={{ padding:28 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:24, color:'#f0f0f8' }}>My Wishlist</h1>
            <p style={{ fontSize:13, color:'#6060a0', marginTop:4 }}>{items.length} saved {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          {items.length > 0 && (
            <button onClick={clear} style={{ padding:'8px 16px', borderRadius:12, background:'rgba(255,82,82,0.1)', border:'1px solid rgba(255,82,82,0.2)', color:'#ff5252', fontSize:12, fontWeight:600, cursor:'pointer' }}>Clear All</button>
          )}
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'#6060a0' }}>
            <div style={{ width:72, height:72, borderRadius:20, background:'#1a1a26', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <Heart size={32} style={{ opacity:.4 }} />
            </div>
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:20, color:'#a0a0c0', fontWeight:600, marginBottom:6 }}>Your wishlist is empty</p>
            <p style={{ fontSize:13, marginBottom:20 }}>Browse our services and save items you love</p>
            <Link href="/" style={{ padding:'10px 24px', borderRadius:12, background:'#ff4d9e', color:'#fff', fontSize:13, fontWeight:600, textDecoration:'none' }}>Start Browsing</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
            {(Object.entries(grouped) as [ServiceType, typeof items][]).map(([service, prods]) => (
              <section key={service}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'#f0f0f8' }}>{SVC[service].emoji} {SVC[service].label}</h2>
                  <Link href={`/${service}`} style={{ fontSize:12, color:'#6060a0', textDecoration:'none' }}>Browse more →</Link>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
                  {prods.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
