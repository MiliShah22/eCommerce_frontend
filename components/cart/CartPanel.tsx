'use client'
import { useEffect } from 'react'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { fmt, svcColor } from '@/lib/utils'

export default function CartPanel() {
  // Stable plain-state selectors only
  const items      = useCart(s => s.items)
  const isOpen     = useCart(s => s.isOpen)
  const close      = useCart(s => s.close)
  const removeItem = useCart(s => s.removeItem)
  const updateQty  = useCart(s => s.updateQty)
  const clear      = useCart(s => s.clear)

  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0)
  const delivery = items.length > 0 ? 40 : 0
  const tax      = Math.round(subtotal * 0.05)
  const total    = subtotal + delivery + tax
  const count    = items.reduce((a, i) => a + i.quantity, 0)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const overlay: React.CSSProperties = { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:40, transition:'opacity 0.3s', opacity:isOpen ? 1 : 0, pointerEvents:isOpen ? 'all' : 'none' }
  const panel: React.CSSProperties   = { position:'fixed', top:0, right:0, height:'100%', width:380, background:'#12121a', borderLeft:'1px solid rgba(255,255,255,0.07)', zIndex:50, display:'flex', flexDirection:'column', transition:'transform 0.3s cubic-bezier(0.4,0,0.2,1)', transform:isOpen ? 'translateX(0)' : 'translateX(100%)' }

  return (
    <>
      <div style={overlay} onClick={close} />
      <div style={panel}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:20, color:'#f0f0f8', display:'flex', alignItems:'center', gap:8 }}>
              <ShoppingBag size={20} style={{ color:'#ff6b35' }} /> My Cart
            </div>
            <div style={{ fontSize:12, color:'#6060a0', marginTop:2 }}>{count} {count === 1 ? 'item' : 'items'}</div>
          </div>
          <button onClick={close} style={{ width:36, height:36, borderRadius:10, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#a0a0c0' }}>
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex:1, overflowY:'auto', padding:16 }}>
          {items.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:12, textAlign:'center', paddingBottom:60 }}>
              <div style={{ width:72, height:72, borderRadius:20, background:'#1a1a26', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <ShoppingBag size={32} style={{ color:'#6060a0' }} />
              </div>
              <div>
                <div style={{ fontSize:16, fontWeight:600, color:'#a0a0c0', fontFamily:'Syne,sans-serif' }}>Your cart is empty</div>
                <div style={{ fontSize:13, color:'#6060a0', marginTop:4 }}>Browse services to add items</div>
              </div>
              <button onClick={close} style={{ marginTop:8, padding:'10px 24px', borderRadius:12, background:'#ff6b35', color:'#fff', border:'none', cursor:'pointer', fontSize:14, fontWeight:600 }}>Start Shopping</button>
            </div>
          ) : (
            items.map(item => {
              const color = svcColor(item.service)
              return (
                <div key={item.id} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:12, borderRadius:14, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.05)', marginBottom:10 }}>
                  <div style={{ width:48, height:48, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, background:`${color}20`, flexShrink:0 }}>{item.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:14, fontWeight:500, color:'#f0f0f8', marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</p>
                    <p style={{ fontSize:11, color:'#6060a0', marginBottom:4 }}>{item.vendorName}{item.variant ? ` · ${item.variant.color || ''}${item.variant.size ? ' / ' + item.variant.size : ''}` : ''}</p>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:14, fontWeight:700, fontFamily:'Syne,sans-serif', color }}>{fmt(item.price * item.quantity)}</span>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <button onClick={() => updateQty(item.id, item.quantity - 1)}
                          style={{ width:24, height:24, borderRadius:6, background:'#22223a', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#a0a0c0' }}>
                          {item.quantity === 1 ? <Trash2 size={10} style={{ color:'#ff5252' }} /> : <Minus size={10} />}
                        </button>
                        <span style={{ fontSize:13, fontWeight:700, color:'#f0f0f8', width:20, textAlign:'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)}
                          style={{ width:24, height:24, borderRadius:6, background:'#22223a', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#a0a0c0' }}>
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#6060a0', padding:2, flexShrink:0, marginTop:2, transition:'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color='#ff5252'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color='#6060a0'}>
                    <X size={13} />
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:12, fontSize:13 }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:'#a0a0c0' }}>Subtotal</span><span style={{ color:'#f0f0f8', fontWeight:500 }}>{fmt(subtotal)}</span></div>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:'#a0a0c0' }}>Delivery fee</span><span style={{ color:'#00c896', fontWeight:500 }}>{fmt(delivery)}</span></div>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:'#a0a0c0' }}>Tax (5%)</span><span style={{ color:'#f0f0f8', fontWeight:500 }}>{fmt(tax)}</span></div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.07)', marginBottom:14 }}>
              <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:'#f0f0f8' }}>Total</span>
              <span style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:20, color:'#ff6b35' }}>{fmt(total)}</span>
            </div>
            <Link href="/checkout" onClick={close}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:'13px 0', borderRadius:12, background:'#ff6b35', color:'#fff', fontWeight:700, fontSize:14, textDecoration:'none', transition:'filter 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.filter='brightness(1.1)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter='brightness(1)'}>
              Checkout <ArrowRight size={16} />
            </Link>
            <button onClick={clear} style={{ display:'block', width:'100%', marginTop:8, fontSize:12, color:'#6060a0', background:'none', border:'none', cursor:'pointer', padding:'4px 0', textAlign:'center' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color='#ff5252'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color='#6060a0'}>
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
