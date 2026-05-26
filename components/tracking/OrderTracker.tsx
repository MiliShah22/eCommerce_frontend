'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, Store, ChefHat, Bike, Home } from 'lucide-react'
import type { OrderStatus } from '@/types'

const STEPS = [
  { label:'Order Placed',  icon:CheckCircle, key:'placed' },
  { label:'Confirmed',     icon:Store,       key:'confirmed' },
  { label:'Preparing',     icon:ChefHat,     key:'preparing' },
  { label:'On the Way',    icon:Bike,        key:'out_for_delivery' },
  { label:'Delivered',     icon:Home,        key:'delivered' },
]
const ORDER_ = ['placed','confirmed','preparing','out_for_delivery','delivered']

export default function OrderTracker({ status, simulateLive=false }: { status: OrderStatus; simulateLive?: boolean }) {
  const [cur, setCur] = useState(status === 'pending' ? 'placed' : status)
  const idx = ORDER_.indexOf(cur)

  useEffect(() => {
    if (!simulateLive || cur === 'delivered' || cur === 'cancelled') return
    const t = setTimeout(() => {
      const next = ORDER_[Math.min(idx+1, ORDER_.length-1)]
      if (next !== cur) setCur(next)
    }, 6000)
    return () => clearTimeout(t)
  }, [cur, simulateLive, idx])

  return (
    <div>
      {simulateLive && cur !== 'delivered' && (
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16, padding:'6px 12px', borderRadius:10, background:'rgba(0,200,150,0.1)', border:'1px solid rgba(0,200,150,0.25)', width:'fit-content' }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:'#00c896', animation:'pulse 1.5s infinite', display:'inline-block' }} />
          <span style={{ fontSize:12, fontWeight:600, color:'#00c896' }}>Live tracking active</span>
        </div>
      )}
      {STEPS.map((step, i) => {
        const done = i <= idx
        const active = i === idx
        const Icon = step.icon
        return (
          <div key={step.key} style={{ display:'flex', gap:16 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', border:`2px solid ${done?'#00c896':'rgba(255,255,255,0.15)'}`, background:done?'#00c896':'#1a1a26', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.5s', boxShadow:active&&cur!=='delivered'?'0 0 0 6px rgba(0,200,150,0.15)':'none' }}>
                <Icon size={15} style={{ color:done?'#fff':'#6060a0' }} />
              </div>
              {i < STEPS.length-1 && <div style={{ width:2, flex:1, minHeight:28, margin:'4px 0', background:i<idx?'#00c896':'rgba(255,255,255,0.07)', transition:'background 0.5s' }} />}
            </div>
            <div style={{ paddingBottom:28, paddingTop:6, flex:1 }}>
              <p style={{ fontSize:14, fontWeight:600, color:done?'#f0f0f8':'#6060a0', marginBottom:active&&cur!=='delivered'?4:0, transition:'color 0.3s' }}>{step.label}</p>
              {active && cur !== 'delivered' && (
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ display:'flex', gap:3 }}>
                    {[0,1,2].map(d => <span key={d} style={{ width:5, height:5, borderRadius:'50%', background:'#ff6b35', display:'inline-block', animation:`bounce 0.8s ${d*0.15}s infinite` }} />)}
                  </div>
                  <span style={{ fontSize:12, color:'#ff6b35' }}>In progress…</span>
                </div>
              )}
              {done && i===0 && <p style={{ fontSize:12, color:'#6060a0' }}>Payment received</p>}
              {cur==='delivered' && i===STEPS.length-1 && <p style={{ fontSize:12, color:'#00c896' }}>🎉 Enjoy!</p>}
            </div>
          </div>
        )
      })}
      {simulateLive && cur !== 'delivered' && (
        <button onClick={() => setCur(ORDER_[Math.min(idx+1,ORDER_.length-1)])} style={{ fontSize:11, color:'#6060a0', background:'none', border:'none', cursor:'pointer', textDecoration:'underline', marginTop:-8 }}>
          Simulate next step →
        </button>
      )}
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  )
}
