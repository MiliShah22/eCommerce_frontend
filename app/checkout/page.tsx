'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'
import { useCart } from '@/store/cart'
import { fmt, svcColor } from '@/lib/utils'
import { ArrowLeft, ArrowRight, CheckCircle, ShieldCheck, MapPin, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

const STEPS = ['Review Cart', 'Delivery', 'Payment', 'Confirm']
const ADDRESSES = [
  { id:'a1', label:'Home', icon:'🏠', addr:'42, Alkapuri Society, Race Course Circle, Vadodara – 390007', def:true },
  { id:'a2', label:'Work', icon:'🏢', addr:'Landmark Business Hub, Productivity Rd, Vadodara – 390020', def:false },
]
const PAYMENT_METHODS = [
  { id:'razorpay', icon:'📱', label:'Razorpay UPI', desc:'Pay via GPay, PhonePe, Paytm', tag:'Recommended' },
  { id:'stripe',   icon:'💳', label:'Stripe Card',  desc:'Credit card, Debit card, Net banking' },
  { id:'cod',      icon:'💵', label:'Cash on Delivery', desc:'Pay when your order arrives' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCart(s => s.items)
  const updateQty = useCart(s => s.updateQty)
  const removeItem = useCart(s => s.removeItem)
  const clear = useCart(s => s.clear)
  const [step, setStep] = useState(0)
  const [addr, setAddr] = useState('a1')
  const [pay, setPay] = useState('razorpay')
  const [done, setDone] = useState(false)
  const [code] = useState(`SW-${Math.random().toString(36).substr(2,8).toUpperCase()}`)

  const sub = items.reduce((a,i) => a+i.price*i.quantity, 0)
  const del = items.length > 0 ? 40 : 0
  const t   = Math.round(sub * 0.05)
  const tot = sub + del + t
  const card: React.CSSProperties = { background:'#16161f', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:24 }
  const inp: React.CSSProperties = { background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 14px', color:'#f0f0f8', fontSize:13, outline:'none', width:'100%', fontFamily:'DM Sans,sans-serif', boxSizing:'border-box' }

  const placeOrder = () => {
    clear()
    setDone(true)
    setStep(3)
    toast.success('🎉 Order placed!', { style:{ background:'#1e1e2e', color:'#f0f0f8', border:'1px solid rgba(0,200,150,0.3)' } })
  }

  if (!items.length && !done) return (
    <>
      <Topbar title="Checkout" />
      <main style={{ padding:28, textAlign:'center', paddingTop:80 }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🛒</div>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:22, color:'#a0a0c0', marginBottom:12 }}>Your cart is empty</h2>
        <Link href="/" style={{ padding:'10px 24px', borderRadius:12, background:'#ff6b35', color:'#fff', fontSize:14, fontWeight:600, textDecoration:'none' }}>Browse Services</Link>
      </main>
    </>
  )

  const stepContent = [
    /* Step 0 – Cart Review */
    <div key="cart">
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
        {items.map(i => (
          <div key={i.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:'#1a1a26', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ fontSize:24, width:36, textAlign:'center' }}>{i.emoji}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:13, fontWeight:600, color:'#f0f0f8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{i.name}</p>
              <p style={{ fontSize:11, color:'#6060a0' }}>{i.vendorName}</p>
              {i.variant && <p style={{ fontSize:11, color:'#6060a0' }}>{i.variant.color}{i.variant.size ? ` · ${i.variant.size}` : ''}</p>}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <button onClick={() => updateQty(i.id, i.quantity-1)} style={{ width:26, height:26, borderRadius:8, background:'#22223a', border:'1px solid rgba(255,255,255,0.08)', color:'#a0a0c0', cursor:'pointer', fontSize:14 }}>−</button>
              <span style={{ fontWeight:700, color:'#f0f0f8', fontSize:13, minWidth:20, textAlign:'center' }}>{i.quantity}</span>
              <button onClick={() => updateQty(i.id, i.quantity+1)} style={{ width:26, height:26, borderRadius:8, background:'#22223a', border:'1px solid rgba(255,255,255,0.08)', color:'#a0a0c0', cursor:'pointer', fontSize:14 }}>+</button>
            </div>
            <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14, color:svcColor(i.service), minWidth:60, textAlign:'right' }}>{fmt(i.price * i.quantity)}</span>
            <button onClick={() => removeItem(i.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#ff5252', padding:'4px' }}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      <button onClick={() => setStep(1)} style={{ width:'100%', padding:'13px', borderRadius:14, background:'#ff6b35', border:'none', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
        Continue to Delivery <ArrowRight size={16} />
      </button>
    </div>,

    /* Step 1 – Delivery */
    <div key="delivery">
      <p style={{ fontSize:11, fontWeight:600, color:'#a0a0c0', textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>Select Address</p>
      {ADDRESSES.map(a => (
        <div key={a.id} onClick={() => setAddr(a.id)} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', borderRadius:14, border:`1px solid ${addr===a.id ? 'rgba(0,200,150,0.4)' : 'rgba(255,255,255,0.08)'}`, background:addr===a.id ? 'rgba(0,200,150,0.06)' : '#1a1a26', cursor:'pointer', marginBottom:10 }}>
          <span style={{ fontSize:22 }}>{a.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <span style={{ fontSize:13, fontWeight:600, color:'#f0f0f8' }}>{a.label}</span>
              {a.def && <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:'rgba(0,200,150,0.15)', color:'#00c896', fontWeight:600 }}>Default</span>}
            </div>
            <p style={{ fontSize:12, color:'#a0a0c0', lineHeight:1.5 }}>{a.addr}</p>
          </div>
          <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${addr===a.id ? '#00c896' : 'rgba(255,255,255,0.2)'}`, background:addr===a.id ? '#00c896' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
            {addr===a.id && <div style={{ width:7, height:7, borderRadius:'50%', background:'#fff' }} />}
          </div>
        </div>
      ))}
      <div style={{ display:'flex', gap:10, marginTop:4 }}>
        <button onClick={() => setStep(0)} style={{ padding:'12px 20px', borderRadius:14, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', color:'#a0a0c0', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}><ArrowLeft size={14} /> Back</button>
        <button onClick={() => setStep(2)} style={{ flex:1, padding:'12px', borderRadius:14, background:'#ff6b35', border:'none', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>Continue to Payment <ArrowRight size={15} /></button>
      </div>
    </div>,

    /* Step 2 – Payment */
    <div key="payment">
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
        {PAYMENT_METHODS.map(m => (
          <div key={m.id} onClick={() => setPay(m.id)} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:14, border:`1px solid ${pay===m.id ? 'rgba(0,200,150,0.4)' : 'rgba(255,255,255,0.08)'}`, background:pay===m.id ? 'rgba(0,200,150,0.06)' : '#1a1a26', cursor:'pointer' }}>
            <span style={{ fontSize:22, width:32, textAlign:'center' }}>{m.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:13, fontWeight:600, color:'#f0f0f8' }}>{m.label}</span>
                {m.tag && <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:'rgba(0,200,150,0.15)', color:'#00c896', fontWeight:600 }}>{m.tag}</span>}
              </div>
              <p style={{ fontSize:11, color:'#6060a0', marginTop:2 }}>{m.desc}</p>
            </div>
            <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${pay===m.id ? '#00c896' : 'rgba(255,255,255,0.2)'}`, background:pay===m.id ? '#00c896' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {pay===m.id && <div style={{ width:7, height:7, borderRadius:'50%', background:'#fff' }} />}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10, background:'#1a1a26', borderRadius:12, padding:'10px 14px', border:'1px solid rgba(255,255,255,0.07)', marginBottom:16 }}>
        <ShieldCheck size={16} style={{ color:'#00c896', flexShrink:0 }} />
        <p style={{ fontSize:12, color:'#a0a0c0' }}>256-bit SSL encryption. Your payment data is fully secure.</p>
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={() => setStep(1)} style={{ padding:'12px 20px', borderRadius:14, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', color:'#a0a0c0', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}><ArrowLeft size={14} /> Back</button>
        <button onClick={placeOrder} style={{ flex:1, padding:'12px', borderRadius:14, background:'#00c896', border:'none', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <CheckCircle size={16} /> Place Order — {fmt(tot)}
        </button>
      </div>
    </div>,

    /* Step 3 – Confirmation */
    <div key="confirm" style={{ textAlign:'center' }}>
      <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(0,200,150,0.15)', border:'2px solid rgba(0,200,150,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
        <CheckCircle size={40} style={{ color:'#00c896' }} />
      </div>
      <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:26, color:'#f0f0f8', marginBottom:8 }}>Order Placed! 🎉</h2>
      <p style={{ fontSize:13, color:'#a0a0c0', marginBottom:16 }}>Your order is confirmed and being prepared.</p>
      <div style={{ display:'inline-block', padding:'8px 20px', borderRadius:12, background:'rgba(0,200,150,0.1)', border:'1px solid rgba(0,200,150,0.25)', fontFamily:'monospace', fontSize:13, color:'#00c896', fontWeight:700, marginBottom:20 }}>{code}</div>
      <div style={{ background:'#1a1a26', borderRadius:16, padding:16, marginBottom:20, textAlign:'left' }}>
        {[['Delivery to', ADDRESSES.find(a=>a.id===addr)?.addr],['Payment via',PAYMENT_METHODS.find(p=>p.id===pay)?.label],['Total Paid', fmt(tot)]].map(([k,v]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13 }}>
            <span style={{ color:'#a0a0c0' }}>{k}</span>
            <span style={{ color:k==='Total Paid'?'#00c896':'#f0f0f8', fontWeight:k==='Total Paid'?700:500 }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={() => router.push('/orders')} style={{ flex:1, padding:'12px', borderRadius:14, background:'#ff6b35', border:'none', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' }}>Track My Order</button>
        <button onClick={() => router.push('/')} style={{ flex:1, padding:'12px', borderRadius:14, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', color:'#a0a0c0', fontSize:13, fontWeight:600, cursor:'pointer' }}>Continue Shopping</button>
      </div>
    </div>,
  ]

  return (
    <>
      <Topbar title="Checkout" />
      <main style={{ padding:28 }}>
        {/* Steps */}
        {step < 3 && (
          <div style={{ display:'flex', marginBottom:32 }}>
            {STEPS.slice(0,3).map((s,i) => (
              <div key={s} style={{ flex:1, display:'flex', alignItems:'center' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', border:`2px solid ${i<step?'#00c896':i===step?'rgba(0,200,150,0.6)':'rgba(255,255,255,0.15)'}`, background:i<step?'#00c896':i===step?'rgba(0,200,150,0.1)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:i<step?'#fff':i===step?'#00c896':'#6060a0' }}>
                    {i<step?'✓':i+1}
                  </div>
                  <span style={{ fontSize:11, marginTop:6, color:i===step?'#00c896':'#6060a0' }}>{s}</span>
                </div>
                {i<2 && <div style={{ flex:1, height:1, background:i<step?'#00c896':'rgba(255,255,255,0.07)', margin:'0 8px', marginBottom:20 }} />}
              </div>
            ))}
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:step===3?'1fr':'1fr 300px', gap:24, alignItems:'start', maxWidth:step===3?480:9999, margin:step===3?'0 auto':0 }}>
          <div style={card}>{stepContent[step]}</div>
          {step < 3 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={card}>
                <p style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:15, color:'#f0f0f8', marginBottom:14 }}>Order Summary</p>
                {items.map(i => (
                  <div key={i.id} style={{ display:'flex', justifyContent:'space-between', fontSize:12, padding:'5px 0', color:'#a0a0c0' }}>
                    <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160 }}>{i.name} ×{i.quantity}</span>
                    <span style={{ color:'#f0f0f8', fontWeight:500, flexShrink:0, marginLeft:8 }}>{fmt(i.price*i.quantity)}</span>
                  </div>
                ))}
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', marginTop:10, paddingTop:10 }}>
                  {[['Subtotal',fmt(sub)],['Delivery',fmt(del)],['Tax (5%)',fmt(t)]].map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#a0a0c0', padding:'4px 0' }}>
                      <span>{k}</span><span style={{ color:'#f0f0f8' }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:17, color:'#ff6b35', paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.07)', marginTop:8 }}>
                    <span style={{ color:'#f0f0f8' }}>Total</span><span>{fmt(tot)}</span>
                  </div>
                </div>
              </div>
              <div style={{ background:'#1a1a26', borderRadius:14, padding:14, display:'flex', gap:10, border:'1px solid rgba(255,255,255,0.05)' }}>
                <ShieldCheck size={16} style={{ color:'#00c896', flexShrink:0, marginTop:2 }} />
                <p style={{ fontSize:12, color:'#a0a0c0', lineHeight:1.5 }}>Secured checkout. Easy returns within 7 days.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
