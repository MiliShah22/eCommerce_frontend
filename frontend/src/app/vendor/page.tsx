'use client'
import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { ORDERS, PRODUCTS } from '@/data'
import { getStatusStyle } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { LayoutDashboard, Package, TrendingUp, Settings, Plus, Edit3, Trash2, Power, ChevronUp, ChevronDown, Star } from 'lucide-react'

const TABS = [
  { id:'orders', label:'Orders', icon: LayoutDashboard },
  { id:'products', label:'Products', icon: Package },
  { id:'earnings', label:'Earnings', icon: TrendingUp },
  { id:'settings', label:'Settings', icon: Settings },
]

const WEEKLY_EARNINGS = [4200, 5800, 3900, 7100, 6200, 8900, 7400]
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function VendorPage() {
  const [tab, setTab] = useState('orders')
  const [isOpen, setIsOpen] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const vendorOrders = ORDERS.filter(o => o.service === 'food')
  const filteredOrders = statusFilter === 'All' ? vendorOrders : vendorOrders.filter(o => o.status === statusFilter.toLowerCase())
  const foodProducts = PRODUCTS.food

  return (
    <>
      <Topbar title="Vendor Panel" />
      <main className="p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-food/15 flex items-center justify-center text-2xl">🍛</div>
            <div>
              <h1 className="font-syne font-black text-2xl text-text">Spice Garden</h1>
              <p className="text-text-3 text-xs">Food Delivery · Vadodara, Gujarat</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-text-2">Store status:</span>
              <button onClick={() => { setIsOpen(v => !v); toast.success(isOpen ? '🔴 Store closed' : '🟢 Store opened') }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-semibold text-sm"
                style={{ background: isOpen ? 'rgba(0,200,150,.1)' : 'rgba(255,82,82,.1)', borderColor: isOpen ? 'rgba(0,200,150,.3)' : 'rgba(255,82,82,.3)', color: isOpen ? '#00c896' : '#ff5252' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: isOpen ? '#00c896' : '#ff5252' }} />
                {isOpen ? 'Open' : 'Closed'}
                <Power size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label:"Today's Orders", val:'12', change:'+3 from yesterday', up:true, color:'#ff6b35' },
            { label:"Today's Revenue", val:'₹4,280', change:'+18% from yesterday', up:true, color:'#00c896' },
            { label:'Pending Orders', val:'3', change:'Needs attention', up:false, color:'#f5c842' },
            { label:'Avg Rating', val:'4.8 ⭐', change:'Based on 312 reviews', up:true, color:'#7c6fff' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-white/[0.07] rounded-2xl p-4">
              <div className="text-xs text-text-3 uppercase tracking-wide mb-2">{s.label}</div>
              <div className="font-syne font-black text-2xl mb-1" style={{ color: s.color }}>{s.val}</div>
              <div className={`text-xs flex items-center gap-1 ${s.up ? 'text-grocery' : 'text-gold'}`}>
                {s.up ? <ChevronUp size={12} /> : <ChevronDown size={12} />} {s.change}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-bg-3 p-1 rounded-xl mb-6 w-fit">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab===t.id ? 'bg-card text-text border border-white/[0.07]' : 'text-text-2 hover:text-text'}`}>
                <Icon size={14} /> {t.label}
              </button>
            )
          })}
        </div>

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {['All','Pending','Confirmed','Preparing','Delivered'].map(s => {
                const count = s === 'All' ? vendorOrders.length : vendorOrders.filter(o => o.status === s.toLowerCase()).length
                return (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border whitespace-nowrap transition-all flex items-center gap-1.5 ${statusFilter===s ? 'bg-bg-4 text-text border-white/20' : 'bg-bg-3 text-text-2 border-white/[0.07] hover:border-white/20'}`}>
                    {s} <span className="bg-bg-4 text-text-3 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{count}</span>
                  </button>
                )
              })}
            </div>
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-text-3">No orders matching this filter</div>
              ) : filteredOrders.map(o => {
                const s = getStatusStyle(o.status)
                return (
                  <div key={o.id} className="flex items-center gap-4 p-4 bg-card border border-white/[0.07] rounded-2xl hover:border-white/[0.12] transition-all">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-bg-3 flex-shrink-0">{o.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-syne font-bold text-text text-sm">#{o.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${s.bg} ${s.text} ${s.border}`}>{o.status.replace('_',' ')}</span>
                      </div>
                      <p className="text-xs text-text-2 truncate">{o.items.join(' · ')}</p>
                      <p className="text-xs text-text-3 mt-0.5">{o.date}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-syne font-bold text-food">₹{o.total}</span>
                      {['pending','confirmed'].includes(o.status) && (
                        <select onChange={e => toast.success(`Order ${o.id} → ${e.target.value}`)}
                          className="bg-bg-3 border border-white/[0.07] rounded-xl px-3 py-2 text-xs text-text outline-none hover:border-white/20">
                          <option>Update Status</option>
                          <option>Confirmed</option>
                          <option>Preparing</option>
                          <option>Ready</option>
                        </select>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm text-text-2">{foodProducts.length} products listed</div>
              <button onClick={() => toast.success('Add product modal')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-food text-white text-sm font-semibold hover:brightness-110 transition-all">
                <Plus size={15} /> Add Product
              </button>
            </div>
            <div className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[60px_1fr_100px_100px_80px_120px] gap-4 px-5 py-3 border-b border-white/[0.07] text-xs text-text-3 font-semibold uppercase tracking-wide">
                <span></span><span>Product</span><span>Category</span><span>Price</span><span>Rating</span><span>Actions</span>
              </div>
              {foodProducts.map(p => (
                <div key={p.id} className="grid grid-cols-[60px_1fr_100px_100px_80px_120px] gap-4 px-5 py-4 border-b border-white/[0.04] items-center hover:bg-bg-3/50 transition-colors last:border-0">
                  <span className="text-2xl text-center">{p.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-text">{p.name}</p>
                    <p className="text-xs text-text-3 mt-0.5 line-clamp-1">{p.description}</p>
                  </div>
                  <span className="text-xs text-text-2">{p.category}</span>
                  <span className="font-syne font-bold text-food text-sm">₹{p.price}</span>
                  <div className="flex items-center gap-1">
                    <Star size={11} fill="#f5c842" stroke="none" />
                    <span className="text-xs text-gold font-semibold">{p.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toast.success(`Edit ${p.name}`)} className="p-2 rounded-lg bg-bg-3 border border-white/[0.07] text-text-2 hover:text-text hover:bg-bg-4 transition-all"><Edit3 size={13} /></button>
                    <button onClick={() => toast.error(`Delete ${p.name}?`)} className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 transition-all"><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Earnings Tab */}
        {tab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label:'Total Earned', val:'₹1,84,320', sub:'All time', color:'#00c896' },
                { label:'Pending Payout', val:'₹12,400', sub:'Paid every Friday', color:'#f5c842' },
                { label:'Platform Commission', val:'₹18,432', sub:'10% of gross earnings', color:'#7c6fff' },
              ].map(s => (
                <div key={s.label} className="bg-card border border-white/[0.07] rounded-2xl p-5">
                  <div className="text-xs text-text-3 uppercase tracking-wide mb-2">{s.label}</div>
                  <div className="font-syne font-black text-3xl mb-1" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-xs text-text-3">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Weekly chart */}
            <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
              <h3 className="font-syne font-bold text-text text-lg mb-5">Weekly Earnings</h3>
              <div className="flex items-end gap-3 h-28">
                {WEEKLY_EARNINGS.map((v, i) => {
                  const max = Math.max(...WEEKLY_EARNINGS)
                  const pct = Math.round((v / max) * 100)
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[10px] text-text-3">₹{(v/1000).toFixed(1)}k</span>
                      <div className="w-full rounded-t-md transition-all min-h-[4px]"
                        style={{ height:`${pct}%`, background: i === 5 ? '#ff6b35' : '#22223a', border: i !== 5 ? '1px solid rgba(255,255,255,0.06)' : 'none' }} />
                      <span className="text-[10px] text-text-3">{DAYS[i]}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Payout history */}
            <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
              <h3 className="font-syne font-bold text-text text-lg mb-4">Payout History</h3>
              <div className="space-y-0 divide-y divide-white/[0.05]">
                {ORDERS.map((o, i) => (
                  <div key={o.id} className="flex items-center gap-3 py-3.5">
                    <div className="w-8 h-8 rounded-xl bg-grocery/10 flex items-center justify-center text-lg flex-shrink-0">{o.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text">#{o.id}</p>
                      <p className="text-xs text-text-3">{o.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-syne font-bold text-grocery text-sm">+₹{Math.round(o.total * 0.9)}</p>
                      <p className="text-[10px] text-text-3">after 10% fee</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${i === 0 ? 'bg-gold/15 text-gold' : 'bg-grocery/15 text-grocery'}`}>{i === 0 ? 'PENDING' : 'PAID'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="max-w-lg space-y-5">
            <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
              <h3 className="font-syne font-bold text-text text-lg mb-5">Business Profile</h3>
              <div className="space-y-4">
                {[['Business Name','Spice Garden','text'],['Tagline','Authentic Indian Cuisine','text'],['Contact Phone','+91 98765 12345','tel'],['Contact Email','spicegarden@example.com','email']].map(([l,v,t]) => (
                  <div key={l}>
                    <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">{l}</label>
                    <input type={t} defaultValue={v} className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-white/20 transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Description</label>
                  <textarea rows={3} defaultValue="Authentic Indian cuisine with fresh ingredients and traditional recipes." className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-white/20 transition-colors resize-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Cuisine Tags</label>
                  <div className="flex gap-2 flex-wrap">
                    {['Indian','Biryani','Curries','South Indian','Tandoor'].map(tag => (
                      <span key={tag} className="px-3 py-1.5 rounded-full text-xs bg-bg-3 text-text-2 border border-white/[0.07] cursor-pointer hover:border-white/20 hover:text-text transition-all">{tag} ×</span>
                    ))}
                    <button className="px-3 py-1.5 rounded-full text-xs bg-bg-3 text-text-3 border border-dashed border-white/[0.1] hover:border-white/20 transition-all">+ Add Tag</button>
                  </div>
                </div>
                <button onClick={() => toast.success('Vendor profile updated ✓')} className="w-full py-3 rounded-xl bg-food text-white font-bold text-sm hover:brightness-110 transition-all">Save Changes</button>
              </div>
            </div>
            <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
              <h3 className="font-syne font-bold text-text text-lg mb-5">Operating Hours</h3>
              <div className="space-y-3">
                {['Monday–Friday','Saturday','Sunday'].map(day => (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-sm text-text-2 w-32 flex-shrink-0">{day}</span>
                    <input type="time" defaultValue="09:00" className="bg-bg-3 border border-white/[0.07] rounded-xl px-3 py-2 text-sm text-text outline-none flex-1" />
                    <span className="text-text-3 text-xs">to</span>
                    <input type="time" defaultValue="22:00" className="bg-bg-3 border border-white/[0.07] rounded-xl px-3 py-2 text-sm text-text outline-none flex-1" />
                  </div>
                ))}
                <button onClick={() => toast.success('Hours saved')} className="w-full py-2.5 rounded-xl bg-bg-3 border border-white/[0.07] text-text text-sm font-medium hover:bg-bg-4 transition-all mt-2">Save Hours</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
