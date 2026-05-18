'use client'
import { useState, useRef, useEffect } from 'react'
import { Bell, X, Check, Package, Truck, Tag, CreditCard, Settings } from 'lucide-react'
import { useNotificationStore, NotificationType } from '@/store/notificationStore'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const TYPE_ICONS: Record<NotificationType, React.ElementType> = {
  order: Package, delivery: Truck, promo: Tag, payment: CreditCard, system: Settings
}
const TYPE_COLORS: Record<NotificationType, string> = {
  order: '#ff6b35', delivery: '#00c896', promo: '#ff4d9e', payment: '#7c6fff', system: '#f5c842'
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { notifications, markRead, markAllRead, remove, getUnreadCount } = useNotificationStore()
  const unread = getUnreadCount()
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 rounded-xl bg-bg-3 border border-white/[0.07] flex items-center justify-center text-text-2 hover:text-text hover:bg-bg-4 transition-all">
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-clothing text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-bg-2">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-card-2 border border-white/[0.07] rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <div className="flex items-center gap-2">
              <h3 className="font-syne font-bold text-sm text-text">Notifications</h3>
              {unread > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-clothing/20 text-clothing font-bold">{unread} new</span>}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead} className="text-[11px] text-text-3 hover:text-grocery transition-colors flex items-center gap-1">
                  <Check size={11} /> All read
                </button>
              )}
              <button onClick={() => { setOpen(false); router.push('/notifications') }}
                className="text-[11px] text-text-3 hover:text-text-2 transition-colors">View all</button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 5).length === 0 ? (
              <div className="p-6 text-center text-text-3 text-sm">No notifications</div>
            ) : notifications.slice(0, 5).map(n => {
              const Icon = TYPE_ICONS[n.type]
              const color = TYPE_COLORS[n.type]
              return (
                <div key={n.id}
                  className={cn('flex gap-3 px-4 py-3 border-b border-white/[0.04] cursor-pointer transition-colors group', !n.isRead ? 'bg-bg-3/60' : 'hover:bg-bg-3/30')}
                  onClick={() => { markRead(n.id); if (n.orderId) { setOpen(false); router.push(`/orders/${n.orderId}`) } }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base" style={{ background: `${color}20` }}>
                    {n.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-xs font-semibold leading-tight', !n.isRead ? 'text-text' : 'text-text-2')}>{n.title}</p>
                      {!n.isRead && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5" style={{ background: color }} />}
                    </div>
                    <p className="text-[11px] text-text-3 mt-0.5 line-clamp-2 leading-relaxed">{n.body}</p>
                    <p className="text-[10px] text-text-3 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); remove(n.id) }}
                    className="opacity-0 group-hover:opacity-100 text-text-3 hover:text-red-400 transition-all flex-shrink-0">
                    <X size={12} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
