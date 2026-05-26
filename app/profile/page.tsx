'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'
import { useAuth } from '@/store/auth'
import { useWishlist } from '@/store/wishlist'
import { useCart } from '@/store/cart'
import { ORDERS } from '@/data'
import { svcColor } from '@/lib/utils'
import { User, MapPin, Settings, Receipt, LogOut, Edit3, Check, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const TABS = [{ id:'orders',label:'Orders',icon:Receipt },{ id:'addresses',label:'Addresses',icon:MapPin },{ id:'settings',label:'Settings',icon:Settings }]
const ADDRESSES = [
  { id:'a1', label:'Home', icon:'🏠', addr:'42, Alkapuri Society, Race Course Circle, Vadodara – 390007', def:true },
  { id:'a2', label:'Work', icon:'🏢', addr:'Landmark Business Hub, Productivity Rd, Vadodara – 390020', def:false },
]
const STATUS_COLORS: Record<string,{bg:string;color:string}> = {
  pending:         { bg:'rgba(245,200,66,.15)',  color:'#f5c842' },
  confirmed:       { bg:'rgba(0,200,150,.15)',   color:'#00c896' },
  preparing:       { bg:'rgba(255,107,53,.15)',  color:'#ff6b35' },
  out_for_delivery:{ bg:'rgba(124,111,255,.15)', color:'#7c6fff' },
  delivered:       { bg:'rgba(124,111,255,.15)', color:'#7c6fff' },
  cancelled:       { bg:'rgba(255,82,82,.15)',   color:'#ff5252' },
}

export default function ProfilePage() {
  const { user, logout, update } = useAuth()
  const { ids } = useWishlist()
  const cartItems = useCart(s => s.items)
  const count = cartItems.reduce((a, i) => a + i.quantity, 0)
  const [tab, setTab] = useState('orders')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name:user?.name||'', email:user?.email||'', phone:user?.phone||'' })
  const router = useRouter()
  const set = (k:string,v:string) => setForm(f=>({...f,[k]:v}))

  const card: React.CSSProperties = { background:'#16161f', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:20 }
  const inp: React.CSSProperties = { background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 14px', color:'#f0f0f8', fontSize:13, outline:'none', width:'100%', fontFamily:'DM Sans,sans-serif', boxSizing:'border-box' }
  const lbl: React.CSSProperties = { fontSize:11, fontWeight:600, color:'#a0a0c0', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }

  const handleSave = () => { update(form); setEditing(false); toast.success('Profile updated ✓') }
  const handleLogout = () => { logout(); router.push('/auth'); toast.success('Logged out') }

  return (
    <>
      <Topbar title="My Profile" />
      <main style={{ padding:28 }}>
        {/* Profile header */}
        <div style={{ ...card, display:'flex', alignItems:'center', gap:20, marginBottom:24 }}>
          <div style={{ position:'relative' }}>
            <div style={{ width:64, height:64, borderRadius:18, background:'linear-gradient(135deg,#7c6fff,#ff4d9e)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:24, color:'#fff' }}>
              {user?.name?.[0]||'J'}
            </div>
            <div style={{ position:'absolute', bottom:-2, right:-2, width:20, height:20, borderRadius:'50%', background:'#00c896', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #0a0a0f' }}>
              <Check size={10} style={{ color:'#fff' }} />
            </div>
          </div>
          <div style={{ flex:1 }}>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:20, color:'#f0f0f8' }}>{user?.name}</h2>
            <p style={{ fontSize:13, color:'#a0a0c0' }}>{user?.email}</p>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:6 }}>
              <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:600, background:user?.role==='ADMIN'?'rgba(255,77,158,.15)':user?.role==='VENDOR'?'rgba(0,200,150,.15)':'rgba(124,111,255,.15)', color:user?.role==='ADMIN'?'#ff4d9e':user?.role==='VENDOR'?'#00c896':'#7c6fff' }}>{user?.role}</span>
              <span style={{ fontSize:12, color:'#6060a0' }}>Member since {user?.joined}</span>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:24, borderLeft:'1px solid rgba(255,255,255,0.07)', paddingLeft:24 }}>
            {[['Orders',ORDERS.length],['Wishlist',ids.length],['Cart',count]].map(([l,v])=>(
              <div key={l as string} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, color:'#f0f0f8' }}>{v}</div>
                <div style={{ fontSize:11, color:'#6060a0', marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
          <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:12, background:'rgba(255,82,82,0.1)', border:'1px solid rgba(255,82,82,0.2)', color:'#ff5252', fontSize:13, fontWeight:600, cursor:'pointer' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:6, background:'#1a1a26', padding:4, borderRadius:14, marginBottom:24, width:'fit-content' }}>
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', border:'none', background:tab===t.id?'#22223a':'transparent', color:tab===t.id?'#f0f0f8':'#6060a0', transition:'all 0.2s' }}>
                <Icon size={14} /> {t.label}
              </button>
            )
          })}
        </div>

        {/* Orders */}
        {tab==='orders' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {ORDERS.map(o => {
              const sc = STATUS_COLORS[o.status] ?? STATUS_COLORS.pending
              return (
                <Link key={o.id} href={`/orders/${o.id}`} style={{ display:'flex', alignItems:'center', gap:14, padding:16, background:'#16161f', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, textDecoration:'none' }}>
                  <div style={{ width:46, height:46, borderRadius:14, background:'#1a1a26', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{o.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:14, color:'#f0f0f8' }}>{o.vendor}</span>
                      <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, background:sc.bg, color:sc.color, textTransform:'uppercase' }}>{o.status.replace('_',' ')}</span>
                    </div>
                    <p style={{ fontSize:12, color:'#a0a0c0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.items.join(' · ')}</p>
                    <p style={{ fontSize:11, color:'#6060a0', marginTop:2 }}>{o.date}</p>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:svcColor(o.service) }}>₹{o.total}</div>
                    <div style={{ fontSize:11, color:'#6060a0', marginTop:2 }}>{o.items.length} items</div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Addresses */}
        {tab==='addresses' && (
          <div style={{ maxWidth:520 }}>
            {ADDRESSES.map(a => (
              <div key={a.id} style={{ ...card, display:'flex', gap:14, alignItems:'flex-start', marginBottom:12 }}>
                <span style={{ fontSize:26 }}>{a.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:14, color:'#f0f0f8' }}>{a.label}</span>
                    {a.def && <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:'rgba(0,200,150,0.15)', color:'#00c896', fontWeight:600 }}>Default</span>}
                  </div>
                  <p style={{ fontSize:13, color:'#a0a0c0', lineHeight:1.6 }}>{a.addr}</p>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={() => toast.success('Edit address')} style={{ width:34,height:34,borderRadius:10,background:'#1a1a26',border:'1px solid rgba(255,255,255,0.08)',color:'#a0a0c0',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}><Edit3 size={14}/></button>
                  {!a.def && <button onClick={() => toast.success('Address deleted')} style={{ width:34,height:34,borderRadius:10,background:'rgba(255,82,82,0.1)',border:'1px solid rgba(255,82,82,0.2)',color:'#ff5252',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}><Trash2 size={14}/></button>}
                </div>
              </div>
            ))}
            <button onClick={() => toast.success('Add new address')} style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 20px', borderRadius:14, background:'transparent', border:'1px dashed rgba(255,255,255,0.15)', color:'#a0a0c0', fontSize:13, fontWeight:600, cursor:'pointer', width:'100%', justifyContent:'center' }}>
              <Plus size={15} /> Add New Address
            </button>
          </div>
        )}

        {/* Settings */}
        {tab==='settings' && (
          <div style={{ maxWidth:460, display:'flex', flexDirection:'column', gap:18 }}>
            <div style={card}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'#f0f0f8' }}>Account Info</h3>
                <button onClick={() => editing ? handleSave() : setEditing(true)} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, fontSize:12, fontWeight:600, cursor:'pointer', border:'none', background:editing?'#00c896':'#1a1a26', color:editing?'#fff':'#a0a0c0' }}>
                  {editing ? <><Check size={13}/> Save</> : <><Edit3 size={13}/> Edit</>}
                </button>
              </div>
              {[['name','Full Name'],['email','Email'],['phone','Phone']].map(([field,label]) => (
                <div key={field} style={{ marginBottom:14 }}>
                  <label style={lbl}>{label}</label>
                  <input value={(form as Record<string,string>)[field]} onChange={e => set(field,e.target.value)} disabled={!editing} style={{ ...inp, opacity:editing?1:.6 }} />
                </div>
              ))}
            </div>
            <div style={card}>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'#f0f0f8', marginBottom:18 }}>Change Password</h3>
              {[['Current Password'],['New Password'],['Confirm New']].map(([l]) => (
                <div key={l} style={{ marginBottom:14 }}>
                  <label style={lbl}>{l}</label>
                  <input type="password" placeholder="••••••••" style={inp} />
                </div>
              ))}
              <button onClick={() => toast.success('Password updated ✓')} style={{ padding:'11px 20px', borderRadius:12, background:'#7c6fff', border:'none', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', width:'100%', marginTop:4 }}>Update Password</button>
            </div>
            <div style={{ background:'rgba(255,82,82,0.06)', border:'1px solid rgba(255,82,82,0.2)', borderRadius:18, padding:18 }}>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#ff5252', marginBottom:6 }}>Danger Zone</h3>
              <p style={{ fontSize:12, color:'#6060a0', marginBottom:14 }}>This action is irreversible. Please proceed with caution.</p>
              <button onClick={() => toast.error('Requires email confirmation')} style={{ padding:'9px 18px', borderRadius:12, background:'rgba(255,82,82,0.12)', border:'1px solid rgba(255,82,82,0.3)', color:'#ff5252', fontSize:13, fontWeight:600, cursor:'pointer' }}>Delete Account</button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
