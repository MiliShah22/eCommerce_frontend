'use client'
import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { ORDERS, VENDORS } from '@/data'
import { statusObj, fmt, svcColor } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { LayoutDashboard, Users, Store, Receipt, BarChart3, TrendingUp, Download, Star, Shield } from 'lucide-react'
import type { ServiceType } from '@/types'

const TABS = [
  { id:'dashboard', label:'Dashboard', icon:LayoutDashboard },
  { id:'users',     label:'Users',     icon:Users },
  { id:'vendors',   label:'Vendors',   icon:Store },
  { id:'orders',    label:'Orders',    icon:Receipt },
  { id:'reports',   label:'Reports',   icon:BarChart3 },
]
const WEEKLY = [62,78,54,89,71,95,83]
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const SVC_STATS = [
  { svc:'food'     as ServiceType, label:'🍛 Food',     rev:980000,  orders:4200, color:'#ff6b35' },
  { svc:'grocery'  as ServiceType, label:'🛒 Grocery',  rev:420000,  orders:1800, color:'#00c896' },
  { svc:'laundry'  as ServiceType, label:'🧺 Laundry',  rev:230000,  orders:1400, color:'#7c6fff' },
  { svc:'clothing' as ServiceType, label:'👗 Clothing', rev:217630,  orders:1032, color:'#ff4d9e' },
]
const TOTAL_REV = SVC_STATS.reduce((s,x) => s+x.rev, 0)

const SAMPLE_USERS = [
  { name:'Priya Sharma',  email:'priya@example.com', role:'USER',   orders:12,  joined:'Jan 2024', status:'active'    },
  { name:'Rajan Mehta',   email:'rajan@example.com', role:'VENDOR', orders:89,  joined:'Nov 2023', status:'active'    },
  { name:'Ananya Patel',  email:'ananya@example.com',role:'USER',   orders:4,   joined:'Mar 2024', status:'suspended' },
  { name:'Vikram Singh',  email:'vikram@example.com',role:'VENDOR', orders:203, joined:'Aug 2023', status:'active'    },
  { name:'Meera Joshi',   email:'meera@example.com', role:'USER',   orders:31,  joined:'Feb 2024', status:'active'    },
]

const ALL_VENDORS = Object.values(VENDORS).flat()

const card: React.CSSProperties = { background:'#16161f', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:20 }
const th: React.CSSProperties = { textAlign:'left', padding:'10px 8px', fontSize:11, color:'#6060a0', fontWeight:600, textTransform:'uppercase', letterSpacing:1 }
const td: React.CSSProperties = { padding:'12px 8px', fontSize:13, borderBottom:'1px solid rgba(255,255,255,0.04)' }

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard')
  const [userSearch, setUserSearch] = useState('')
  const [userRole, setUserRole] = useState('All')
  const [orderSvc, setOrderSvc] = useState('All')
  const [orderStatus, setOrderStatus] = useState('All')

  const filteredUsers = SAMPLE_USERS.filter(u =>
    (u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())) &&
    (userRole === 'All' || u.role === userRole)
  )
  const filteredOrders = ORDERS.filter(o =>
    (orderSvc === 'All' || o.service === orderSvc.toLowerCase()) &&
    (orderStatus === 'All' || o.status === orderStatus.toLowerCase().replace(/ /g,'_'))
  )

  const inp: React.CSSProperties = { background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'9px 14px', color:'#f0f0f8', fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif' }
  const sel: React.CSSProperties = { ...inp, cursor:'pointer' }

  return (
    <>
      <Topbar title="Admin Panel" />
      <main style={{ padding:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:24, color:'#f0f0f8' }}>Admin Panel</h1>
          <span style={{ fontSize:11, padding:'4px 12px', borderRadius:20, fontWeight:700, background:'rgba(255,77,158,0.15)', color:'#ff4d9e', border:'1px solid rgba(255,77,158,0.25)', display:'flex', alignItems:'center', gap:5 }}>
            <Shield size={11}/> ADMIN
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:6, background:'#1a1a26', padding:4, borderRadius:14, marginBottom:28, width:'fit-content', overflowX:'auto' }}>
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', border:'none', background:tab===t.id?'#22223a':'transparent', color:tab===t.id?'#f0f0f8':'#6060a0', whiteSpace:'nowrap' }}>
                <Icon size={14}/> {t.label}
              </button>
            )
          })}
        </div>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* KPIs */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
              {[
                { label:'Total Revenue',    val:'₹18.5L', change:'+18.3% this month', color:'#00c896' },
                { label:'Total Orders',     val:'8,432',  change:'+12% this week',    color:'#ff6b35' },
                { label:'Registered Users', val:'24,891', change:'+340 today',        color:'#7c6fff' },
                { label:'Active Vendors',   val:'312',    change:'8 pending approval', color:'#f5c842' },
              ].map(s => (
                <div key={s.label} style={card}>
                  <div style={{ fontSize:11, color:'#6060a0', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>{s.label}</div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:30, color:s.color, marginBottom:6 }}>{s.val}</div>
                  <div style={{ fontSize:12, color:'#a0a0c0', display:'flex', alignItems:'center', gap:4 }}>
                    <TrendingUp size={11} style={{ color:s.color }}/> {s.change}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {/* Bar chart */}
              <div style={card}>
                <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'#f0f0f8', marginBottom:20 }}>Weekly Orders</h2>
                <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:120 }}>
                  {WEEKLY.map((v,i) => {
                    const max = Math.max(...WEEKLY)
                    return (
                      <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                        <span style={{ fontSize:10, color:'#6060a0' }}>{v}k</span>
                        <div style={{ width:'100%', borderRadius:'4px 4px 0 0', background:i===5?'#ff6b35':'#22223a', border:i!==5?'1px solid rgba(255,255,255,0.06)':'none', height:`${Math.round(v/max*100)}%`, minHeight:4, transition:'height 0.3s' }}/>
                        <span style={{ fontSize:10, color:'#6060a0' }}>{DAYS[i]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Revenue by service */}
              <div style={card}>
                <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'#f0f0f8', marginBottom:20 }}>Revenue by Service</h2>
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {SVC_STATS.map(s => (
                    <div key={s.svc}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6 }}>
                        <span style={{ color:s.color, fontWeight:500 }}>{s.label}</span>
                        <span style={{ color:'#a0a0c0' }}>₹{(s.rev/1000).toFixed(0)}k · {s.orders} orders</span>
                      </div>
                      <div style={{ background:'#22223a', borderRadius:4, height:7 }}>
                        <div style={{ background:s.color, height:'100%', borderRadius:4, width:`${Math.round(s.rev/TOTAL_REV*100)}%`, transition:'width 0.4s' }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent orders table */}
            <div style={card}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'#f0f0f8' }}>Recent Orders</h2>
                <Link href="/orders" style={{ fontSize:12, color:'#6060a0', textDecoration:'none' }}>View all →</Link>
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                      {['Order ID','Service','Vendor','Amount','Status','Date'].map(h => <th key={h} style={th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {ORDERS.map(o => {
                      const ss = statusObj(o.status)
                      return (
                        <tr key={o.id} style={{ cursor:'pointer' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.02)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='transparent'}>
                          <td style={td}><Link href={`/orders/${o.id}`} style={{ fontFamily:'monospace', fontSize:11, color:'#a0a0c0', textDecoration:'none' }}>#{o.id}</Link></td>
                          <td style={td}><span style={{ fontSize:18 }}>{o.emoji}</span></td>
                          <td style={{ ...td, color:'#a0a0c0' }}>{o.vendor}</td>
                          <td style={{ ...td, fontFamily:'Syne,sans-serif', fontWeight:700, color:svcColor(o.service) }}>{fmt(o.total)}</td>
                          <td style={td}><span style={{ fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, textTransform:'uppercase', letterSpacing:0.5, background:ss.bg, color:ss.color, border:ss.border }}>{o.status.replace('_',' ')}</span></td>
                          <td style={{ ...td, color:'#6060a0' }}>{o.date}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div>
            <div style={{ display:'flex', gap:10, marginBottom:18 }}>
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by name or email…" style={{ ...inp, flex:1 }} />
              <select value={userRole} onChange={e => setUserRole(e.target.value)} style={sel}>
                <option>All</option><option>USER</option><option>VENDOR</option><option>ADMIN</option>
              </select>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {filteredUsers.map((u,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:16, ...card }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#7c6fff,#ff4d9e)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:'#fff', flexShrink:0 }}>{u.name[0]}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3, flexWrap:'wrap' }}>
                      <span style={{ fontWeight:600, fontSize:14, color:'#f0f0f8' }}>{u.name}</span>
                      <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, fontWeight:700, background:u.role==='VENDOR'?'rgba(0,200,150,.15)':'rgba(124,111,255,.15)', color:u.role==='VENDOR'?'#00c896':'#7c6fff' }}>{u.role}</span>
                      {u.status==='suspended' && <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, fontWeight:700, background:'rgba(255,82,82,.12)', color:'#ff5252' }}>SUSPENDED</span>}
                    </div>
                    <p style={{ fontSize:12, color:'#6060a0' }}>{u.email} · Joined {u.joined} · {u.orders} orders</p>
                  </div>
                  <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                    <button onClick={() => toast.success(`Viewing ${u.name}`)} style={{ padding:'7px 14px', borderRadius:10, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', color:'#a0a0c0', fontSize:12, cursor:'pointer' }}>View</button>
                    {u.status==='active'
                      ? <button onClick={() => toast.error(`${u.name} suspended`)} style={{ padding:'7px 14px', borderRadius:10, background:'rgba(255,82,82,.08)', border:'1px solid rgba(255,82,82,.2)', color:'#ff5252', fontSize:12, cursor:'pointer' }}>Suspend</button>
                      : <button onClick={() => toast.success(`${u.name} reactivated`)} style={{ padding:'7px 14px', borderRadius:10, background:'rgba(0,200,150,.08)', border:'1px solid rgba(0,200,150,.2)', color:'#00c896', fontSize:12, cursor:'pointer' }}>Activate</button>
                    }
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && <p style={{ textAlign:'center', padding:'40px 0', color:'#6060a0' }}>No users found</p>}
            </div>
          </div>
        )}

        {/* ── VENDORS ── */}
        {tab === 'vendors' && (
          <div>
            <div style={{ display:'flex', gap:8, marginBottom:18 }}>
              {[['All', ALL_VENDORS.length],['Approved', ALL_VENDORS.length-3],['Pending', 3]].map(([l,c]) => (
                <div key={l as string} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:12, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', fontSize:13, cursor:'pointer' }}>
                  <span style={{ color:'#a0a0c0' }}>{l as string}</span>
                  <span style={{ fontWeight:700, color:'#f0f0f8' }}>{c as number}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {ALL_VENDORS.map(v => (
                <div key={v.id} style={{ display:'flex', alignItems:'center', gap:14, padding:16, ...card }}>
                  <div style={{ width:48, height:48, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0, background:v.color }}>{v.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14, color:'#f0f0f8' }}>{v.name}</span>
                      {v.isOpen
                        ? <span style={{ fontSize:10, color:'#00c896', fontWeight:700, display:'flex', alignItems:'center', gap:3 }}><span style={{ width:6,height:6,borderRadius:'50%',background:'#00c896',display:'inline-block'}}/>Open</span>
                        : <span style={{ fontSize:10, color:'#ff5252', fontWeight:700 }}>Closed</span>}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:5 }}>
                      <Star size={11} fill="#f5c842" stroke="none"/>
                      <span style={{ fontSize:12, color:'#f5c842', fontWeight:600 }}>{v.rating}</span>
                      <span style={{ fontSize:12, color:'#6060a0' }}>· {v.deliveryTime}</span>
                    </div>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      {v.tags.map(t => <span key={t} style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:'#22223a', color:'#6060a0' }}>{t}</span>)}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                    <button onClick={() => toast.success(`✅ ${v.name} approved`)} style={{ padding:'7px 14px', borderRadius:10, background:'rgba(0,200,150,.08)', border:'1px solid rgba(0,200,150,.2)', color:'#00c896', fontSize:12, fontWeight:600, cursor:'pointer' }}>Approve</button>
                    <button onClick={() => toast.error(`${v.name} rejected`)} style={{ padding:'7px 14px', borderRadius:10, background:'rgba(255,82,82,.08)', border:'1px solid rgba(255,82,82,.2)', color:'#ff5252', fontSize:12, cursor:'pointer' }}>Reject</button>
                    <button onClick={() => toast(`Viewing ${v.name}`)} style={{ padding:'7px 14px', borderRadius:10, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', color:'#a0a0c0', fontSize:12, cursor:'pointer' }}>View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div>
            <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap' }}>
              <select value={orderSvc} onChange={e => setOrderSvc(e.target.value)} style={sel}>
                <option>All</option><option>food</option><option>grocery</option><option>laundry</option><option>clothing</option>
              </select>
              <select value={orderStatus} onChange={e => setOrderStatus(e.target.value)} style={sel}>
                <option>All</option><option>pending</option><option>confirmed</option><option>preparing</option><option>out_for_delivery</option><option>delivered</option><option>cancelled</option>
              </select>
              <input type="date" style={sel}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {filteredOrders.map(o => {
                const ss = statusObj(o.status)
                return (
                  <Link key={o.id} href={`/orders/${o.id}`} style={{ display:'flex', alignItems:'center', gap:14, padding:16, ...card, textDecoration:'none' }}>
                    <div style={{ width:46, height:46, borderRadius:14, background:'#1a1a26', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{o.emoji}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                        <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14, color:'#f0f0f8' }}>{o.vendor}</span>
                        <span style={{ fontFamily:'monospace', fontSize:11, color:'#6060a0' }}>#{o.id}</span>
                      </div>
                      <p style={{ fontSize:12, color:'#a0a0c0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.items.join(' · ')}</p>
                      <p style={{ fontSize:11, color:'#6060a0', marginTop:2 }}>{o.date}</p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
                      <span style={{ fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, textTransform:'uppercase', letterSpacing:0.5, background:ss.bg, color:ss.color, border:ss.border }}>{o.status.replace('_',' ')}</span>
                      <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:svcColor(o.service) }}>{fmt(o.total)}</span>
                    </div>
                  </Link>
                )
              })}
              {filteredOrders.length === 0 && <p style={{ textAlign:'center', padding:'40px 0', color:'#6060a0' }}>No orders match this filter</p>}
            </div>
          </div>
        )}

        {/* ── REPORTS ── */}
        {tab === 'reports' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div style={card}>
              <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'#f0f0f8', marginBottom:20 }}>Generate Report</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:'#a0a0c0', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>Report Type</label>
                  <select style={{ ...sel, width:'100%' }}><option>Sales Summary</option><option>Vendor Performance</option><option>Order Analytics</option><option>Revenue by Service</option></select>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:'#a0a0c0', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>From</label>
                    <input type="date" style={{ ...inp, width:'100%' }}/>
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:'#a0a0c0', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>To</label>
                    <input type="date" style={{ ...inp, width:'100%' }}/>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:'#a0a0c0', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>Service</label>
                  <select style={{ ...sel, width:'100%' }}><option>All Services</option><option>Food</option><option>Grocery</option><option>Laundry</option><option>Clothing</option></select>
                </div>
                <button onClick={() => toast.success('📊 Report exported!')} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:13, borderRadius:12, background:'#00c896', border:'none', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer' }}>
                  <Download size={16}/> Export CSV
                </button>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={card}>
                <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'#f0f0f8', marginBottom:14 }}>Quick Stats</h2>
                {[['Avg Order Value','₹219'],['Commission Earned','₹1.85L'],['Refund Rate','2.3%'],['Customer Retention','76%'],['Top Service','Food (53%)'],['Peak Hour','7–9 PM'],['New Users/Week','1,240']].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13 }}>
                    <span style={{ color:'#a0a0c0' }}>{k}</span>
                    <span style={{ fontWeight:600, color:'#f0f0f8' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={card}>
                <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'#f0f0f8', marginBottom:14 }}>Service Breakdown</h2>
                {SVC_STATS.map(s => (
                  <div key={s.svc} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:`${s.color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>{s.label.split(' ')[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                        <span style={{ color:'#a0a0c0' }}>{s.label.split(' ').slice(1).join(' ')}</span>
                        <span style={{ color:s.color, fontWeight:700 }}>{Math.round(s.rev/TOTAL_REV*100)}%</span>
                      </div>
                      <div style={{ background:'#22223a', borderRadius:3, height:5 }}>
                        <div style={{ background:s.color, height:'100%', borderRadius:3, width:`${Math.round(s.rev/TOTAL_REV*100)}%` }}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
