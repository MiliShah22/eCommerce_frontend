'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, ShoppingBag, X, Bell } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useNotifs } from '@/store/notifications'
import { ALL_PRODUCTS, SVC } from '@/data'
import { svcColor } from '@/lib/utils'

export default function Topbar({ title }: { title?: string }) {
  const [q, setQ]           = useState('')
  const [results, setResults] = useState<typeof ALL_PRODUCTS>([])
  const [open, setOpen]       = useState(false)
  const router = useRouter()
  const ref    = useRef<HTMLDivElement>(null)

  // Stable selectors — read plain state, no method calls
  const cartCount  = useCart(s => s.items.reduce((a, i) => a + i.quantity, 0))
  const toggleCart = useCart(s => s.toggle)
  const notifItems = useNotifs(s => s.items)
  const unread     = notifItems.filter(n => !n.isRead).length

  useEffect(() => {
    if (!q.trim()) { setResults([]); return }
    const lo = q.toLowerCase()
    setResults(ALL_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(lo) || p.category.toLowerCase().includes(lo) || p.vendor.toLowerCase().includes(lo)
    ).slice(0, 7))
  }, [q])

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  return (
    <header style={{ height:62, background:'#12121a', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:16, padding:'0 24px', position:'sticky', top:0, zIndex:30 }}>
      <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:18, color:'#f0f0f8', marginRight:8 }}>{title || 'SwiftServe'}</span>
      <div style={{ flex:1 }} />

      {/* Search */}
      <div ref={ref} style={{ position:'relative' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'8px 14px', width:280 }}>
          <Search size={14} style={{ color:'#6060a0', flexShrink:0 }} />
          <input value={q} onChange={e => { setQ(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            onKeyDown={e => { if (e.key === 'Enter' && q.trim()) { router.push(`/search?q=${encodeURIComponent(q)}`); setQ(''); setOpen(false) } }}
            placeholder="Search food, grocery, fashion…"
            style={{ background:'transparent', border:'none', outline:'none', color:'#f0f0f8', fontSize:14, width:'100%', fontFamily:'DM Sans,sans-serif' }} />
          {q && <button onClick={() => { setQ(''); setResults([]) }} style={{ background:'none', border:'none', cursor:'pointer', color:'#6060a0', display:'flex' }}><X size={13} /></button>}
        </div>
        {open && results.length > 0 && (
          <div style={{ position:'absolute', top:'calc(100% + 8px)', left:0, right:0, background:'#1e1e2e', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden', zIndex:50, boxShadow:'0 24px 48px rgba(0,0,0,0.6)' }}>
            {results.map(p => (
              <button key={p.id} onMouseDown={() => { router.push(`/product/${p.id}`); setQ(''); setOpen(false) }}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'10px 16px', border:'none', background:'transparent', cursor:'pointer', textAlign:'left', color:'#f0f0f8', transition:'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='#1a1a26'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='transparent'}>
                <span style={{ fontSize:20, width:30, textAlign:'center' }}>{p.emoji}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize:11, color:'#6060a0' }}>{p.vendor} · {SVC[p.service].label}</div>
                </div>
                <span style={{ fontSize:13, fontWeight:700, fontFamily:'Syne,sans-serif', color:svcColor(p.service), flexShrink:0 }}>₹{p.price}</span>
              </button>
            ))}
            <button onMouseDown={() => { router.push(`/search?q=${encodeURIComponent(q)}`); setQ(''); setOpen(false) }}
              style={{ width:'100%', padding:'10px 16px', borderTop:'1px solid rgba(255,255,255,0.05)', background:'transparent', border:'none', color:'#6060a0', fontSize:12, cursor:'pointer', textAlign:'center' }}>
              See all results for "{q}" →
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <Link href="/notifications" style={{ position:'relative', width:36, height:36, borderRadius:10, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', color:'#a0a0c0', textDecoration:'none' }}>
          <Bell size={16} />
          {unread > 0 && <span style={{ position:'absolute', top:-4, right:-4, background:'#ff4d9e', color:'#fff', fontSize:10, fontWeight:700, minWidth:16, height:16, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #0a0a0f' }}>{unread > 9 ? '9+' : unread}</span>}
        </Link>
        <button onClick={toggleCart}
          style={{ position:'relative', width:36, height:36, borderRadius:10, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', color:'#a0a0c0', cursor:'pointer' }}>
          <ShoppingBag size={16} />
          {cartCount > 0 && <span style={{ position:'absolute', top:-4, right:-4, background:'#ff6b35', color:'#fff', fontSize:10, fontWeight:700, minWidth:16, height:16, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #0a0a0f' }}>{cartCount > 99 ? '99+' : cartCount}</span>}
        </button>
        <Link href="/profile" style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#7c6fff,#ff4d9e)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#fff', fontSize:13, textDecoration:'none' }}>JD</Link>
      </div>
    </header>
  )
}
