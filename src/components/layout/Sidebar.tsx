'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home, UtensilsCrossed, ShoppingBasket, Shirt, ShoppingBag,
  Receipt, Heart, Store, LayoutDashboard, User, Search, Bell
} from 'lucide-react'
import { useNotificationStore } from '@/store/notificationStore'

const NAV = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/food', icon: UtensilsCrossed, label: 'Food Delivery', color: 'text-food' },
  { href: '/grocery', icon: ShoppingBasket, label: 'Grocery', color: 'text-grocery' },
  { href: '/laundry', icon: Shirt, label: 'Laundry', color: 'text-laundry' },
  { href: '/clothing', icon: ShoppingBag, label: 'Clothing', color: 'text-clothing' },
]
const NAV2 = [
  { href: '/orders', icon: Receipt, label: 'My Orders' },
  { href: '/wishlist', icon: Heart, label: 'Wishlist' },
  { href: '/notifications', icon: Bell, label: 'Notifications', badge: true },
]
const NAV3 = [
  { href: '/vendor', icon: Store, label: 'Vendor Panel' },
  { href: '/admin', icon: LayoutDashboard, label: 'Admin Panel' },
]

function NavItem({ href, icon: Icon, label, color, badge }: { href: string; icon: React.ElementType; label: string; color?: string; badge?: boolean }) {
  const pathname = usePathname()
  const active = pathname === href || (href !== '/' && pathname.startsWith(href))
  const unread = useNotificationStore(s => s.getUnreadCount())

  return (
    <Link href={href} className="group relative">
      <div className={cn(
        'w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150',
        active ? 'bg-bg-4' : 'hover:bg-bg-3',
        active ? (color || 'text-text') : 'text-text-3 hover:text-text-2',
        active && color ? color : ''
      )}>
        <Icon size={19} />
        {badge && unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-clothing border border-bg-2" />
        )}
        <span className="absolute left-14 bg-card-2 text-text text-xs font-medium px-2.5 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/[0.1] z-50 shadow-2xl">
          {label}
        </span>
      </div>
    </Link>
  )
}

export default function Sidebar() {
  return (
    <aside className="w-[72px] bg-bg-2 border-r border-white/[0.07] flex flex-col items-center py-5 gap-1.5 sticky top-0 h-screen z-40 flex-shrink-0">
      <Link href="/" className="w-10 h-10 rounded-xl bg-gradient-to-br from-food to-clothing flex items-center justify-center font-syne font-black text-white text-base mb-3 hover:scale-105 transition-transform flex-shrink-0">
        S
      </Link>
      {NAV.map(n => <NavItem key={n.href} {...n} />)}
      <div className="w-8 h-px bg-white/[0.07] my-2" />
      {NAV2.map(n => <NavItem key={n.href} {...n} />)}
      <div className="w-8 h-px bg-white/[0.07] my-2" />
      {NAV3.map(n => <NavItem key={n.href} {...n} />)}
      <div className="mt-auto">
        <NavItem href="/profile" icon={User} label="Profile" />
      </div>
    </aside>
  )
}
