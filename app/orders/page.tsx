'use client'
import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { ORDERS } from '@/data'
import { svcColor, fmt } from '@/lib/utils'
import Link from 'next/link'
import { Package } from 'lucide-react'
import type { OrderStatus } from '@/types'

const TABS = ['All','Active','Completed','Cancelled']
const ACTIVE = ['pending','confirmed','preparing','out_for_delivery']

const STATUS_STYLE: Record<OrderStatus, { bg:string; color:string; border:string }> = {
  pending:          { bg:'rgba(245,200,66,0.15)',  color:'#f5c842', border:'1px solid rgba(245,200,66,0.3)' },
  confirmed:        { bg:'rgba(0,200,150,0.15)',   color:'#00c896', border:'1px solid rgba(0,200,150,0.3)' },
  preparing:        { bg:'rgba(255,107,53,0.15)',  color:'#ff6b35', border:'1px solid rgba(255,107,53,0.3)' },
  out_for_delivery: { bg:'rgba(124,111,255,0.15)', color:'#7c6fff', border:'1px solid rgba(124,111,255,0.3)' },
  delivered:        { bg:'rgba(0,200,150,0.15)',   color:'#00c896', border:'1px solid rgba(0,200,150,0.3)' },
  cancelled:        { bg:'rgba(255,82,82,0.15)',   color:'#ff5252', border:'1px solid rgba(255,82,82,0.3)' },
}

export default function OrdersPage() {
  const [tab, setTab] = useState('All')
  const filtered = ORDERS.filter(o => {
    if (tab==='Active') return ACTIVE.includes(o.status)
    if (tab==='Completed') return o.status==='delivered'
    if (tab==='Cancelled') return o.status==='cancelled'
    return true
  })

  return (
    <>
      <Topbar title="My Orders" />
      <main style={{ padding:28 }}>
        <div style={{ display:'flex', gap:4, background:'#1a1a26', padding:4, borderRadius:14, marginBottom:24, width:'fit-content' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding:'8px 20px', borderRadius:10, fontSize:13, fontWeight:500, cursor:'pointer', border:tab===t?'1px solid rgba(255,255,255,0.1)':'1px solid transparent', background:tab===t?'#16161f':'transparent', color:tab===t?'#f0f0f8':'#a0a0c0', transition:'all 0.15s' }}>
              {t}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'#6060a0' }}>
            <Package size={52} style={{ margin:'0 auto 16px', opacity:0.4 }} />
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:20, color:'#a0a0c0', fontWeight:600 }}>No orders here</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {filtered.map(o => {
              const sc = svcColor(o.service)
              const ss = STATUS_STYLE[o.status] ?? STATUS_STYLE.pending
              return (
                <Link key={o.id} href={`/orders/${o.id}`}
                  style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:16, padding:16, background:'#16161f', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, transition:'border-color 0.2s', cursor:'pointer' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.14)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.07)'}>
                  <div style={{ width:48, height:48, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, background:`${sc}20`, flexShrink:0 }}>{o.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                      <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14, color:'#f0f0f8' }}>{o.vendor}</span>
                      <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, textTransform:'uppercase', letterSpacing:0.5, background:ss.bg, color:ss.color, border:ss.border }}>
                        {o.status.replace('_',' ')}
                      </span>
                    </div>
                    <p style={{ fontSize:12, color:'#a0a0c0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:3 }}>{o.items.join(' · ')}</p>
                    <p style={{ fontSize:11, color:'#6060a0' }}>{o.date} · #{o.id}</p>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <p style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:sc }}>{fmt(o.total)}</p>
                    <p style={{ fontSize:11, color:'#6060a0', marginTop:3 }}>{o.items.length} item{o.items.length!==1?'s':''}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
