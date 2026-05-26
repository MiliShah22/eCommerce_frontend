'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, UtensilsCrossed, ShoppingBasket, Shirt, ShoppingBag, Receipt, Heart, Bell, Store, LayoutDashboard, User } from 'lucide-react'
import { useNotifs } from '@/store/notifications'

const NAV_TOP = [
  { href:'/', icon:Home, label:'Home' },
  { href:'/search', icon:Search, label:'Search' },
  { href:'/food', icon:UtensilsCrossed, label:'Food', clr:'#ff6b35' },
  { href:'/grocery', icon:ShoppingBasket, label:'Grocery', clr:'#00c896' },
  { href:'/laundry', icon:Shirt, label:'Laundry', clr:'#7c6fff' },
  { href:'/clothing', icon:ShoppingBag, label:'Clothing', clr:'#ff4d9e' },
]
const NAV_MID = [
  { href:'/orders', icon:Receipt, label:'My Orders' },
  { href:'/wishlist', icon:Heart, label:'Wishlist' },
  { href:'/notifications', icon:Bell, label:'Notifications', badge:true },
]
const NAV_BOT = [
  { href:'/vendor', icon:Store, label:'Vendor Panel' },
  { href:'/admin', icon:LayoutDashboard, label:'Admin' },
]

function NavItem({ href, icon:Icon, label, clr, badge }: { href:string; icon:React.ElementType; label:string; clr?:string; badge?:boolean }) {
  const path = usePathname()
  // Stable selector — plain state read, no method calls
  const notifItems = useNotifs(s => s.items)
  const unread = notifItems.filter(n => !n.isRead).length

  const active = path === href || (href !== '/' && path.startsWith(href))
  const col = active ? (clr || '#f0f0f8') : '#6060a0'

  return (
    <Link href={href} style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }} className="group">
      <div style={{ width:44, height:44, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', background:active ? '#22223a' : 'transparent', color:col, transition:'all 0.15s', position:'relative' }}>
        <Icon size={19} />
        {badge && unread > 0 && (
          <span style={{ position:'absolute', top:8, right:8, width:8, height:8, borderRadius:'50%', background:'#ff4d9e', border:'2px solid #0a0a0f' }} />
        )}
        <span style={{ position:'absolute', left:56, background:'#1e1e2e', color:'#f0f0f8', fontSize:12, fontWeight:500, padding:'5px 10px', borderRadius:8, whiteSpace:'nowrap', opacity:0, pointerEvents:'none', border:'1px solid rgba(255,255,255,0.1)', zIndex:100, boxShadow:'0 8px 24px rgba(0,0,0,0.5)' }} className="group-hover:opacity-100 transition-opacity">{label}</span>
      </div>
    </Link>
  )
}

const Sep = () => <div style={{ width:32, height:1, background:'rgba(255,255,255,0.07)', margin:'6px 0' }} />

export default function Sidebar() {
  return (
    <aside style={{ width:72, background:'#12121a', borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', alignItems:'center', padding:'20px 0', gap:4, position:'sticky', top:0, height:'100vh', zIndex:40, flexShrink:0 }}>
      <Link href="/" style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#ff6b35,#ff4d9e)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:16, color:'#fff', marginBottom:8, textDecoration:'none' }}>S</Link>
      {NAV_TOP.map(n => <NavItem key={n.href} {...n} />)}
      <Sep />
      {NAV_MID.map(n => <NavItem key={n.href} {...n} />)}
      <Sep />
      {NAV_BOT.map(n => <NavItem key={n.href} {...n} />)}
      <div style={{ marginTop:'auto' }}>
        <NavItem href="/profile" icon={User} label="Profile" />
      </div>
    </aside>
  )
}
