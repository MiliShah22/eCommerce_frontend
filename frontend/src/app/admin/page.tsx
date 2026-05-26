'use client'
import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { ORDERS, VENDORS } from '@/data'
import { getStatusStyle } from '@/lib/utils'


import Link from 'next/link'
import toast from 'react-hot-toast'
import { LayoutDashboard, Users, Store, Receipt, BarChart3, TrendingUp, TrendingDown, ChevronUp, Star, Download } from 'lucide-react'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'vendors', label: 'Vendors', icon: Store },
  { id: 'orders', label: 'Orders', icon: Receipt },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
]

const WEEKLY = [62, 78, 54, 89, 71, 95, 83]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SERVICE_STATS = [
  { service: 'food', label: '🍛 Food', rev: 980000, orders: 4200, color: '#ff6b35' },
  { service: 'grocery', label: '🛒 Grocery', rev: 420000, orders: 1800, color: '#00c896' },
  { service: 'laundry', label: '🧺 Laundry', rev: 230000, orders: 1400, color: '#7c6fff' },
  { service: 'clothing', label: '👗 Clothing', rev: 217630, orders: 1032, color: '#ff4d9e' },
]
const TOTAL_REV = SERVICE_STATS.reduce((s, x) => s + x.rev, 0)

const SAMPLE_USERS = [
  { name: 'Priya Sharma', email: 'priya@example.com', role: 'USER', orders: 12, joined: 'Jan 2024', status: 'active' },
  { name: 'Rajan Mehta', email: 'rajan@example.com', role: 'VENDOR', orders: 89, joined: 'Nov 2023', status: 'active' },
  { name: 'Ananya Patel', email: 'ananya@example.com', role: 'USER', orders: 4, joined: 'Mar 2024', status: 'suspended' },
  { name: 'Vikram Singh', email: 'vikram@example.com', role: 'VENDOR', orders: 203, joined: 'Aug 2023', status: 'active' },
  { name: 'Meera Joshi', email: 'meera@example.com', role: 'USER', orders: 31, joined: 'Feb 2024', status: 'active' },
]

const ALL_VENDORS = Object.values(VENDORS).flat()

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard')
  const [userSearch, setUserSearch] = useState('')
  const [userRole, setUserRole] = useState('All')
  const [orderService, setOrderService] = useState('All')
  const [orderStatus, setOrderStatus] = useState('All')

  const filteredUsers = SAMPLE_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
    const matchRole = userRole === 'All' || u.role === userRole
    return matchSearch && matchRole
  })

  const filteredOrders = ORDERS.filter(o => {
    const matchService = orderService === 'All' || o.service === orderService.toLowerCase()
    const matchStatus = orderStatus === 'All' || o.status === orderStatus.toLowerCase()
    return matchService && matchStatus
  })

  return (
    <>
      <Topbar title="Admin Panel" />
      <main className="p-7">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="font-syne font-black text-2xl text-text">Admin Panel</h1>
          <span className="text-xs px-3 py-1 rounded-full font-bold bg-clothing/12 text-clothing border border-clothing/25">ADMIN</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-bg-3 p-1 rounded-xl mb-7 w-fit overflow-x-auto">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${tab === t.id ? 'bg-card text-text border border-white/[0.07]' : 'text-text-2 hover:text-text'}`}>
                <Icon size={14} /> {t.label}
              </button>
            )
          })}
        </div>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', val: '₹18.5L', change: '+18.3% this month', up: true, color: '#00c896' },
                { label: 'Total Orders', val: '8,432', change: '+12% this week', up: true, color: '#ff6b35' },
                { label: 'Registered Users', val: '24,891', change: '+340 today', up: true, color: '#7c6fff' },
                { label: 'Active Vendors', val: '312', change: '8 pending approval', up: false, color: '#f5c842' },
              ].map(s => (
                <div key={s.label} className="bg-card border border-white/[0.07] rounded-2xl p-5">
                  <div className="text-xs text-text-3 uppercase tracking-wide mb-3">{s.label}</div>
                  <div className="font-syne font-black text-3xl mb-2" style={{ color: s.color }}>{s.val}</div>
                  <div className={`text-xs flex items-center gap-1 ${s.up ? 'text-grocery' : 'text-gold'}`}>
                    {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {s.change}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Bar chart */}
              <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
                <h2 className="font-syne font-bold text-text text-lg mb-5">Weekly Orders</h2>
                <div className="flex items-end gap-2.5 h-28">
                  {WEEKLY.map((v, i) => {
                    const max = Math.max(...WEEKLY)
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <span className="text-[10px] text-text-3">{v}k</span>
                        <div className="w-full rounded-t transition-all min-h-1"
                          style={{ height: `${(v / max) * 100}%`, background: i === 5 ? '#ff6b35' : '#22223a', border: i !== 5 ? '1px solid rgba(255,255,255,0.06)' : 'none' }} />
                        <span className="text-[10px] text-text-3">{DAYS[i]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Revenue by service */}
              <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
                <h2 className="font-syne font-bold text-text text-lg mb-5">Revenue by Service</h2>
                <div className="space-y-4">
                  {SERVICE_STATS.map(s => (
                    <div key={s.service}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span style={{ color: s.color }} className="font-medium">{s.label}</span>
                        <span className="text-text-2">₹{(s.rev / 1000).toFixed(0)}k · {s.orders} orders</span>
                      </div>
                      <div className="bg-bg-3 rounded-full h-2">
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.round(s.rev / TOTAL_REV * 100)}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent orders table */}
            <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-syne font-bold text-text text-lg">Recent Orders</h2>
                <Link href="/orders" className="text-xs text-text-3 hover:text-text-2 transition-colors">View all →</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.07]">
                      {['Order ID', 'Service', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                        <th key={h} className="text-left py-3 px-2 text-xs text-text-3 font-semibold uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ORDERS.map(o => {
                      const s = getStatusStyle(o.status)
                      const svcColor: Record<string, string> = { food: '#ff6b35', grocery: '#00c896', laundry: '#7c6fff', clothing: '#ff4d9e' }
                      return (
                        <tr key={o.id} className="border-b border-white/[0.04] hover:bg-bg-3/50 transition-colors cursor-pointer" onClick={() => { }}>
                          <td className="py-3.5 px-2 font-mono text-xs text-text-2">#{o.id}</td>
                          <td className="py-3.5 px-2 text-xl">{o.emoji}</td>
                          <td className="py-3.5 px-2 text-text-2">John D.</td>
                          <td className="py-3.5 px-2 font-syne font-bold" style={{ color: svcColor[o.service] }}>₹{o.total}</td>
                          <td className="py-3.5 px-2">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase ${s.bg} ${s.text} ${s.border}`}>{o.status.replace('_', ' ')}</span>
                          </td>
                          <td className="py-3.5 px-2 text-xs text-text-3">{o.date}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div>
            <div className="flex gap-3 mb-5">
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by name or email…"
                className="flex-1 bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 outline-none focus:border-white/20 transition-colors" />
              <select value={userRole} onChange={e => setUserRole(e.target.value)}
                className="bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-text outline-none hover:border-white/20 transition-colors">
                <option>All</option><option>USER</option><option>VENDOR</option><option>ADMIN</option>
              </select>
            </div>
            <div className="space-y-3">
              {filteredUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-card border border-white/[0.07] rounded-2xl">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-laundry to-clothing flex items-center justify-center font-syne font-bold text-white text-base flex-shrink-0">{u.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-semibold text-text text-sm">{u.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border"
                        style={{ background: u.role === 'VENDOR' ? 'rgba(0,200,150,.12)' : 'rgba(124,111,255,.12)', color: u.role === 'VENDOR' ? '#00c896' : '#7c6fff', borderColor: u.role === 'VENDOR' ? 'rgba(0,200,150,.25)' : 'rgba(124,111,255,.25)' }}>
                        {u.role}
                      </span>
                      {u.status === 'suspended' && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-500/12 text-red-400 border border-red-500/25">SUSPENDED</span>}
                    </div>
                    <p className="text-xs text-text-3">{u.email} · Joined {u.joined} · {u.orders} orders</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => toast.success(`Viewing ${u.name}`)} className="px-3 py-1.5 rounded-lg bg-bg-3 border border-white/[0.07] text-text-2 text-xs hover:text-text hover:bg-bg-4 transition-all">View</button>
                    {u.status === 'active'
                      ? <button onClick={() => toast.error(`${u.name} suspended`)} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/15 transition-all">Suspend</button>
                      : <button onClick={() => toast.success(`${u.name} reactivated`)} className="px-3 py-1.5 rounded-lg bg-grocery/10 border border-grocery/25 text-grocery text-xs hover:bg-grocery/15 transition-all">Activate</button>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VENDORS */}
        {tab === 'vendors' && (
          <div>
            <div className="flex gap-3 mb-5">
              {[['All', ALL_VENDORS.length], ['Approved', ALL_VENDORS.length - 3], ['Pending', 3]].map(([l, c]) => (
                <div key={l as string} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-3 border border-white/[0.07] text-sm cursor-pointer hover:border-white/20 transition-colors">
                  <span className="text-text-2">{l as string}</span>
                  <span className="font-bold text-text">{c as number}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {ALL_VENDORS.map(v => (
                <div key={v.id} className="flex items-center gap-4 p-4 bg-card border border-white/[0.07] rounded-2xl hover:border-white/[0.12] transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: v.color }}>{v.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-syne font-bold text-text text-sm">{v.name}</span>
                      {v.isOpen
                        ? <span className="text-[10px] text-grocery font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-grocery inline-block" />Open</span>
                        : <span className="text-[10px] text-red-400 font-bold">Closed</span>}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <Star size={11} fill="#f5c842" stroke="none" /><span className="text-xs text-gold font-semibold">{v.rating}</span>
                      <span className="text-xs text-text-3">· {v.deliveryTime}</span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {v.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-bg-3 text-text-3 border border-white/[0.07]">{t}</span>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => toast.success(`✅ ${v.name} approved`)} className="px-3 py-1.5 rounded-lg bg-grocery/10 border border-grocery/25 text-grocery text-xs font-semibold hover:bg-grocery/15 transition-all">Approve</button>
                    <button onClick={() => toast.error(`${v.name} rejected`)} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/15 transition-all">Reject</button>
                    <button onClick={() => toast(`Viewing ${v.name}`)} className="px-3 py-1.5 rounded-lg bg-bg-3 border border-white/[0.07] text-text-2 text-xs hover:bg-bg-4 transition-all">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {tab === 'orders' && (
          <div>
            <div className="flex gap-3 mb-5 flex-wrap">
              <select value={orderService} onChange={e => setOrderService(e.target.value)}
                className="bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-text outline-none hover:border-white/20 transition-colors">
                <option>All</option><option>Food</option><option>Grocery</option><option>Laundry</option><option>Clothing</option>
              </select>
              <select value={orderStatus} onChange={e => setOrderStatus(e.target.value)}
                className="bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-text outline-none hover:border-white/20 transition-colors">
                <option>All</option><option>Pending</option><option>Confirmed</option><option>Preparing</option><option>Delivered</option><option>Cancelled</option>
              </select>
              <input type="date" className="bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-text outline-none hover:border-white/20 transition-colors" />
            </div>
            <div className="space-y-3">
              {filteredOrders.map(o => {
                const s = getStatusStyle(o.status)
                const svcColor: Record<string, string> = { food: '#ff6b35', grocery: '#00c896', laundry: '#7c6fff', clothing: '#ff4d9e' }
                return (
                  <Link key={o.id} href={`/orders/${o.id}`}
                    className="flex items-center gap-4 p-4 bg-card border border-white/[0.07] rounded-2xl hover:border-white/[0.12] transition-all">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-bg-3 flex-shrink-0">{o.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-syne font-bold text-text text-sm">{o.vendor}</span>
                        <span className="font-mono text-xs text-text-3">#{o.id}</span>
                      </div>
                      <p className="text-xs text-text-2 truncate">{o.items.join(' · ')}</p>
                      <p className="text-xs text-text-3 mt-0.5">{o.date}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase ${s.bg} ${s.text} ${s.border}`}>{o.status.replace('_', ' ')}</span>
                      <span className="font-syne font-bold text-base" style={{ color: svcColor[o.service] }}>₹{o.total}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* REPORTS */}
        {tab === 'reports' && (
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
              <h2 className="font-syne font-bold text-text text-lg mb-5">Generate Report</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Report Type</label>
                  <select className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-white/20 transition-colors">
                    <option>Sales Summary</option><option>Vendor Performance</option><option>Order Analytics</option><option>Revenue by Service</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">From</label>
                    <input type="date" className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-white/20" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">To</label>
                    <input type="date" className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-white/20" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Service Filter</label>
                  <select className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-white/20 transition-colors">
                    <option>All Services</option><option>Food</option><option>Grocery</option><option>Laundry</option><option>Clothing</option>
                  </select>
                </div>
                <button onClick={() => toast.success('📊 Report exported successfully!')} className="w-full py-3 rounded-xl bg-grocery text-white font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                  <Download size={16} /> Export CSV
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
                <h2 className="font-syne font-bold text-text text-lg mb-4">Quick Stats</h2>
                <div className="divide-y divide-white/[0.05]">
                  {[['Average Order Value', '₹219'], ['Commission Earned (Total)', '₹1.85L'], ['Refund Rate', '2.3%'], ['Customer Retention', '76%'], ['Top Performing Service', 'Food (53%)'], ['Peak Ordering Hour', '7 PM – 9 PM'], ['New Users This Week', '1,240']].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-3 text-sm">
                      <span className="text-text-2">{k}</span>
                      <span className="font-bold text-text">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
                <h2 className="font-syne font-bold text-text text-lg mb-4">Service Breakdown</h2>
                <div className="space-y-4">
                  {SERVICE_STATS.map(s => (
                    <div key={s.service} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: `${s.color}20` }}>{s.label.split(' ')[0]}</div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-2">{s.label.split(' ').slice(1).join(' ')}</span>
                          <span style={{ color: s.color }} className="font-bold">{Math.round(s.rev / TOTAL_REV * 100)}%</span>
                        </div>
                        <div className="bg-bg-3 rounded-full h-1.5">
                          <div className="h-full rounded-full" style={{ width: `${Math.round(s.rev / TOTAL_REV * 100)}%`, background: s.color }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
