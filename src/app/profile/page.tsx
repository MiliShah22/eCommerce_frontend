'use client'
import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { useAuthStore } from '@/store/authStore'
import { ORDERS } from '@/data'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { getStatusStyle } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { User, MapPin, Settings, Receipt, Heart, LogOut, Edit3, Plus, Trash2, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

const TABS = [
  { id:'orders', label:'Orders', icon: Receipt },
  { id:'addresses', label:'Addresses', icon: MapPin },
  { id:'settings', label:'Settings', icon: Settings },
]

const ADDRESSES = [
  { id:'a1', label:'Home', icon:'🏠', address:'42, Alkapuri Society, Race Course Circle, Vadodara – 390007', default:true },
  { id:'a2', label:'Work', icon:'🏢', address:'Landmark Business Hub, Productivity Rd, Vadodara – 390020', default:false },
]

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuthStore()
  const { productIds } = useWishlistStore()
  const { getCount } = useCartStore()
  const [tab, setTab] = useState('orders')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })
  const router = useRouter()

  const handleSave = () => {
    updateProfile(form)
    setEditing(false)
    toast.success('Profile updated ✓', { style:{ background:'#1e1e2e', color:'#f0f0f8', border:'1px solid rgba(0,200,150,.3)' } })
  }

  const handleLogout = () => {
    logout()
    router.push('/auth')
    toast.success('Logged out successfully')
  }

  const serviceColor: Record<string,string> = { food:'#ff6b35', grocery:'#00c896', laundry:'#7c6fff', clothing:'#ff4d9e' }

  return (
    <>
      <Topbar title="My Profile" />
      <main className="p-7">
        {/* Profile Header */}
        <div className="bg-card border border-white/[0.07] rounded-2xl p-6 mb-6 flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-laundry to-clothing flex items-center justify-center font-syne font-black text-2xl text-white">
              {user?.name?.[0] || 'J'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-grocery flex items-center justify-center border-2 border-bg-2">
              <Check size={10} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="font-syne font-bold text-xl text-text">{user?.name}</h2>
            <p className="text-text-2 text-sm">{user?.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold border"
                style={{ background:user?.role==='ADMIN'?'rgba(255,77,158,.12)':user?.role==='VENDOR'?'rgba(0,200,150,.12)':'rgba(124,111,255,.12)', color:user?.role==='ADMIN'?'#ff4d9e':user?.role==='VENDOR'?'#00c896':'#7c6fff', borderColor:user?.role==='ADMIN'?'rgba(255,77,158,.25)':user?.role==='VENDOR'?'rgba(0,200,150,.25)':'rgba(124,111,255,.25)' }}>
                {user?.role}
              </span>
              <span className="text-xs text-text-3">Member since {user?.joined}</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-center border-l border-white/[0.07] pl-6">
            {[['Orders', ORDERS.length],['Wishlist', productIds.length],['Cart', getCount()]].map(([l,v]) => (
              <div key={l as string}>
                <div className="font-syne font-black text-2xl text-text">{v}</div>
                <div className="text-xs text-text-3 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/15 transition-all ml-2">
            <LogOut size={14} /> Logout
          </button>
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
          <div className="space-y-3">
            {ORDERS.map(o => {
              const s = getStatusStyle(o.status)
              return (
                <Link key={o.id} href={`/orders/${o.id}`}
                  className="flex items-center gap-4 p-4 bg-card border border-white/[0.07] rounded-2xl hover:border-white/[0.12] transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-bg-3 flex-shrink-0">{o.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-syne font-bold text-text text-sm">{o.vendor}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${s.bg} ${s.text} ${s.border}`}>{o.status.replace('_',' ')}</span>
                    </div>
                    <p className="text-xs text-text-2 truncate">{o.items.join(' · ')}</p>
                    <p className="text-xs text-text-3 mt-0.5">{o.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-syne font-bold text-text" style={{ color: serviceColor[o.service] }}>₹{o.total}</p>
                    <p className="text-xs text-text-3 mt-1">{o.items.length} items</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Addresses Tab */}
        {tab === 'addresses' && (
          <div className="space-y-4 max-w-xl">
            {ADDRESSES.map(addr => (
              <div key={addr.id} className="bg-card border border-white/[0.07] rounded-2xl p-5 flex items-start gap-4">
                <span className="text-2xl mt-0.5">{addr.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-syne font-semibold text-text text-sm">{addr.label}</span>
                    {addr.default && <span className="text-[10px] px-2 py-0.5 rounded-full bg-grocery/15 text-grocery font-bold">Default</span>}
                  </div>
                  <p className="text-sm text-text-2 leading-relaxed">{addr.address}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toast.success('Edit address')} className="p-2 rounded-xl bg-bg-3 border border-white/[0.07] text-text-2 hover:text-text hover:bg-bg-4 transition-all"><Edit3 size={14} /></button>
                  {!addr.default && <button onClick={() => toast.success('Address deleted')} className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 transition-all"><Trash2 size={14} /></button>}
                </div>
              </div>
            ))}
            <button onClick={() => toast.success('Add new address modal')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-bg-3 border border-dashed border-white/[0.12] text-text-2 text-sm font-medium hover:border-white/25 hover:text-text transition-all w-full justify-center">
              <Plus size={16} /> Add New Address
            </button>
          </div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="max-w-md space-y-6">
            <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-syne font-bold text-text text-lg">Account Info</h3>
                <button onClick={() => editing ? handleSave() : setEditing(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${editing ? 'bg-grocery text-white' : 'bg-bg-3 border border-white/[0.07] text-text-2 hover:text-text'}`}>
                  {editing ? <><Check size={13} /> Save Changes</> : <><Edit3 size={13} /> Edit</>}
                </button>
              </div>
              <div className="space-y-4">
                {[['Full Name','name','text'],['Email Address','email','email'],['Phone Number','phone','tel']].map(([label, field, type]) => (
                  <div key={field}>
                    <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">{label}</label>
                    <input type={type} value={(form as Record<string,string>)[field]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      disabled={!editing}
                      className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none transition-all disabled:opacity-60 focus:border-white/20" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
              <h3 className="font-syne font-bold text-text text-lg mb-5">Change Password</h3>
              <div className="space-y-4">
                {[['Current Password','current'],['New Password','new'],['Confirm New Password','confirm']].map(([label, field]) => (
                  <div key={field}>
                    <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">{label}</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text placeholder-text-3 outline-none focus:border-white/20 transition-colors" />
                  </div>
                ))}
                <button onClick={() => toast.success('Password updated ✓')} className="w-full py-3 rounded-xl bg-laundry text-white font-semibold text-sm hover:brightness-110 transition-all mt-2">
                  Update Password
                </button>
              </div>
            </div>

            <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
              <h3 className="font-syne font-bold text-text text-lg mb-4">Notifications</h3>
              <div className="space-y-4">
                {[['Order Updates','Get real-time SMS & app notifications for all orders',true],['Promotions & Offers','Exclusive deals and discount codes',false],['Delivery Alerts','Pickup and delivery notifications',true]].map(([l,d,checked]) => (
                  <div key={l as string} className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text">{l as string}</p>
                      <p className="text-xs text-text-3 mt-0.5">{d as string}</p>
                    </div>
                    <div onClick={() => toast.success(`${l} preference toggled`)}
                      className="w-11 h-6 rounded-full flex items-center px-1 cursor-pointer transition-all flex-shrink-0 mt-0.5"
                      style={{ background: (checked as boolean) ? '#00c896' : '#22223a', justifyContent: (checked as boolean) ? 'flex-end' : 'flex-start' }}>
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-500/[0.06] border border-red-500/20 rounded-2xl p-5">
              <h3 className="font-syne font-bold text-red-400 mb-1">Danger Zone</h3>
              <p className="text-xs text-text-3 mb-4">These actions are irreversible. Please proceed with caution.</p>
              <button onClick={() => toast.error('Account deletion requires email confirmation')} className="px-5 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-all">
                Delete Account
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
