'use client'
import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { ORDERS, PRODUCTS } from '@/data'
import { statusObj, fmt, svcColor } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { LayoutDashboard, Package, TrendingUp, Settings, Plus, Edit3, Trash2, Power, Star, ChevronUp, ChevronDown } from 'lucide-react'

const TABS = [
  { id:'orders',   label:'Orders',   icon:LayoutDashboard },
  { id:'products', label:'Products', icon:Package },
  { id:'earnings', label:'Earnings', icon:TrendingUp },
  { id:'settings', label:'Settings', icon:Settings },
]
const WEEKLY_EARN = [4200,5800,3900,7100,6200,8900,7400]
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const card: React.CSSProperties = { background:'#16161f', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:20 }
const inp: React.CSSProperties = { background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 14px', color:'#f0f0f8', fontSize:13, outline:'none', width:'100%', fontFamily:'DM Sans,sans-serif', boxSizing:'border-box' }
const lbl: React.CSSProperties = { fontSize:11, fontWeight:600, color:'#a0a0c0', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }

export default function VendorPage() {
  const [tab, setTab] = useState('orders')
  const [isOpen, setIsOpen] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const vendorOrders = ORDERS.filter(o => o.service === 'food')
  const filtered = statusFilter === 'All' ? vendorOrders : vendorOrders.filter(o => o.status === statusFilter.toLowerCase().replace(/ /g,'_'))
  const products = PRODUCTS['food']

  return (
    <>
      <Topbar title="Vendor Panel" />
      <main style={{ padding:28 }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:48, height:48, borderRadius:16, background:'rgba(255,107,53,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🍛</div>
            <div>
              <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, color:'#f0f0f8' }}>Spice Garden</h1>
              <p style={{ fontSize:12, color:'#6060a0' }}>Food Delivery · Vadodara</p>
            </div>
          </div>
          <button onClick={() => { setIsOpen(v=>!v); toast.success(isOpen?'🔴 Store closed':'🟢 Store opened') }}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 18px', borderRadius:12, border:'1px solid', cursor:'pointer', fontWeight:600, fontSize:13, transition:'all 0.2s', borderColor:isOpen?'rgba(0,200,150,0.3)':'rgba(255,82,82,0.3)', background:isOpen?'rgba(0,200,150,.08)':'rgba(255,82,82,.08)', color:isOpen?'#00c896':'#ff5252' }}>
            <span style={{ width:8,height:8,borderRadius:'50%',background:isOpen?'#00c896':'#ff5252',display:'inline-block' }}/>
            {isOpen ? 'Store Open' : 'Store Closed'}
            <Power size={13}/>
          </button>
        </div>

        {/* KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
          {[
            { label:"Today's Orders",  val:'12',    change:'+3 from yesterday', up:true,  color:'#ff6b35' },
            { label:"Today's Revenue", val:'₹4,280',change:'+18%',             up:true,  color:'#00c896' },
            { label:'Pending',          val:'3',     change:'Need attention',   up:false, color:'#f5c842' },
            { label:'Avg Rating',       val:'4.8 ⭐', change:'312 reviews',     up:true,  color:'#7c6fff' },
          ].map(s => (
            <div key={s.label} style={card}>
              <div style={{ fontSize:11, color:'#6060a0', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>{s.label}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:24, color:s.color, marginBottom:6 }}>{s.val}</div>
              <div style={{ fontSize:11, color:'#a0a0c0', display:'flex', alignItems:'center', gap:3 }}>
                {s.up ? <ChevronUp size={12} style={{ color:'#00c896' }}/> : <ChevronDown size={12} style={{ color:'#f5c842' }}/>} {s.change}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:6, background:'#1a1a26', padding:4, borderRadius:14, marginBottom:24, width:'fit-content' }}>
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', border:'none', background:tab===t.id?'#22223a':'transparent', color:tab===t.id?'#f0f0f8':'#6060a0' }}>
                <Icon size={14}/> {t.label}
              </button>
            )
          })}
        </div>

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div>
            <div style={{ display:'flex', gap:8, marginBottom:16, overflowX:'auto' }}>
              {['All','Pending','Confirmed','Preparing','Delivered'].map(s => {
                const cnt = s==='All' ? vendorOrders.length : vendorOrders.filter(o => o.status===s.toLowerCase()).length
                return (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', border:'1px solid', whiteSpace:'nowrap', transition:'all 0.15s', borderColor:statusFilter===s?'rgba(255,255,255,0.25)':'rgba(255,255,255,0.08)', background:statusFilter===s?'#22223a':'transparent', color:statusFilter===s?'#f0f0f8':'#6060a0' }}>
                    {s} <span style={{ background:'#1a1a26', color:'#6060a0', borderRadius:'50%', width:18, height:18, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:10 }}>{cnt}</span>
                  </button>
                )
              })}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {filtered.length === 0 ? <p style={{ textAlign:'center', padding:'40px 0', color:'#6060a0' }}>No orders for this filter</p> :
                filtered.map(o => {
                  const ss = statusObj(o.status)
                  const isActive = ['pending','confirmed'].includes(o.status)
                  return (
                    <div key={o.id} style={{ display:'flex', alignItems:'center', gap:14, padding:16, ...card }}>
                      <div style={{ width:46, height:46, borderRadius:14, background:'#1a1a26', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{o.emoji}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                          <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14, color:'#f0f0f8' }}>#{o.id}</span>
                          <span style={{ fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, textTransform:'uppercase', letterSpacing:0.5, background:ss.bg, color:ss.color, border:ss.border }}>{o.status.replace('_',' ')}</span>
                        </div>
                        <p style={{ fontSize:12, color:'#a0a0c0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.items.join(' · ')}</p>
                        <p style={{ fontSize:11, color:'#6060a0', marginTop:2 }}>{o.date}</p>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                        <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:'#ff6b35' }}>{fmt(o.total)}</span>
                        {isActive && (
                          <select onChange={e => e.target.value && toast.success(`Order ${o.id} → ${e.target.value}`)}
                            style={{ background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'6px 12px', fontSize:12, color:'#f0f0f8', outline:'none', cursor:'pointer' }}>
                            <option value="">Update Status</option>
                            <option>confirmed</option><option>preparing</option><option>out_for_delivery</option>
                          </select>
                        )}
                        <Link href={`/orders/${o.id}`} style={{ padding:'7px 14px', borderRadius:10, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', color:'#a0a0c0', fontSize:12, textDecoration:'none' }}>View</Link>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <span style={{ fontSize:14, color:'#a0a0c0' }}>{products.length} products listed</span>
              <Link href="/vendor/products/new"
                style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:12, background:'#ff6b35', color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none' }}>
                <Plus size={15}/> Add Product
              </Link>
            </div>
            <div style={{ ...card, padding:0, overflow:'hidden' }}>
              <div style={{ display:'grid', gridTemplateColumns:'52px 1fr 100px 90px 70px 100px', gap:8, padding:'12px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                {['','Product','Category','Price','Rating','Actions'].map(h => (
                  <span key={h} style={{ fontSize:11, color:'#6060a0', fontWeight:600, textTransform:'uppercase', letterSpacing:1 }}>{h}</span>
                ))}
              </div>
              {products.map(p => (
                <div key={p.id} style={{ display:'grid', gridTemplateColumns:'52px 1fr 100px 90px 70px 100px', gap:8, padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.04)', alignItems:'center', transition:'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='transparent'}>
                  <span style={{ fontSize:24, textAlign:'center' }}>{p.emoji}</span>
                  <div>
                    <p style={{ fontSize:13, fontWeight:600, color:'#f0f0f8' }}>{p.name}</p>
                    <p style={{ fontSize:11, color:'#6060a0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:200 }}>{p.description}</p>
                  </div>
                  <span style={{ fontSize:12, color:'#a0a0c0' }}>{p.category}</span>
                  <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14, color:'#ff6b35' }}>{fmt(p.price)}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                    <Star size={11} fill="#f5c842" stroke="none"/>
                    <span style={{ fontSize:12, color:'#f5c842', fontWeight:600 }}>{p.rating}</span>
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={() => toast.success(`Edit ${p.name}`)} style={{ width:30,height:30,borderRadius:8,background:'#1a1a26',border:'1px solid rgba(255,255,255,0.08)',color:'#a0a0c0',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}><Edit3 size={13}/></button>
                    <button onClick={() => toast.error(`Delete ${p.name}?`)} style={{ width:30,height:30,borderRadius:8,background:'rgba(255,82,82,.08)',border:'1px solid rgba(255,82,82,.2)',color:'#ff5252',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}><Trash2 size={13}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EARNINGS ── */}
        {tab === 'earnings' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
              {[
                { label:'Total Earned',       val:'₹1,84,320', sub:'All time',            color:'#00c896' },
                { label:'Pending Payout',      val:'₹12,400',  sub:'Paid every Friday',   color:'#f5c842' },
                { label:'Platform Commission', val:'₹18,432',  sub:'10% of gross earnings',color:'#7c6fff' },
              ].map(s => (
                <div key={s.label} style={card}>
                  <div style={{ fontSize:11, color:'#6060a0', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>{s.label}</div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:28, color:s.color, marginBottom:4 }}>{s.val}</div>
                  <div style={{ fontSize:12, color:'#6060a0' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={card}>
              <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'#f0f0f8', marginBottom:20 }}>Weekly Earnings</h2>
              <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:110 }}>
                {WEEKLY_EARN.map((v,i) => {
                  const max = Math.max(...WEEKLY_EARN)
                  return (
                    <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                      <span style={{ fontSize:10, color:'#6060a0' }}>₹{(v/1000).toFixed(1)}k</span>
                      <div style={{ width:'100%', borderRadius:'4px 4px 0 0', background:i===5?'#ff6b35':'#22223a', border:i!==5?'1px solid rgba(255,255,255,0.06)':'none', height:`${Math.round(v/max*100)}%`, minHeight:4 }}/>
                      <span style={{ fontSize:10, color:'#6060a0' }}>{DAYS[i]}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={card}>
              <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'#f0f0f8', marginBottom:14 }}>Payout History</h2>
              {ORDERS.map((o,i) => (
                <div key={o.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:'rgba(0,200,150,.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>{o.emoji}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:500, color:'#f0f0f8' }}>#{o.id}</p>
                    <p style={{ fontSize:11, color:'#6060a0' }}>{o.date}</p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#00c896', fontSize:14 }}>+{fmt(Math.round(o.total*.9))}</p>
                    <p style={{ fontSize:10, color:'#6060a0' }}>after 10% fee</p>
                  </div>
                  <span style={{ fontSize:10, padding:'2px 10px', borderRadius:20, fontWeight:700, background:i===0?'rgba(245,200,66,.12)':'rgba(0,200,150,.12)', color:i===0?'#f5c842':'#00c896' }}>{i===0?'PENDING':'PAID'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {tab === 'settings' && (
          <div style={{ maxWidth:500, display:'flex', flexDirection:'column', gap:16 }}>
            <div style={card}>
              <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'#f0f0f8', marginBottom:20 }}>Business Profile</h2>
              {[['Business Name','Spice Garden'],['Tagline','Authentic Indian Cuisine'],['Phone','+91 98765 12345'],['Email','spicegarden@example.com']].map(([l,v]) => (
                <div key={l} style={{ marginBottom:14 }}>
                  <label style={lbl}>{l}</label>
                  <input defaultValue={v} style={inp}/>
                </div>
              ))}
              <div style={{ marginBottom:14 }}>
                <label style={lbl}>Description</label>
                <textarea rows={3} defaultValue="Authentic Indian cuisine with fresh ingredients and traditional recipes." style={{ ...inp, resize:'none' }}/>
              </div>
              <button onClick={() => toast.success('Vendor profile updated ✓')} style={{ padding:13, borderRadius:12, background:'#ff6b35', border:'none', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', width:'100%' }}>
                Save Changes
              </button>
            </div>
            <div style={card}>
              <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'#f0f0f8', marginBottom:18 }}>Operating Hours</h2>
              {['Monday–Friday','Saturday','Sunday'].map(day => (
                <div key={day} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <span style={{ fontSize:13, color:'#a0a0c0', width:120, flexShrink:0 }}>{day}</span>
                  <input type="time" defaultValue="09:00" style={{ ...inp, flex:1, padding:'8px 12px' }}/>
                  <span style={{ fontSize:12, color:'#6060a0' }}>to</span>
                  <input type="time" defaultValue="22:00" style={{ ...inp, flex:1, padding:'8px 12px' }}/>
                </div>
              ))}
              <button onClick={() => toast.success('Hours saved')} style={{ padding:'10px', borderRadius:12, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', color:'#a0a0c0', fontSize:13, cursor:'pointer', width:'100%', marginTop:6 }}>
                Save Hours
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
