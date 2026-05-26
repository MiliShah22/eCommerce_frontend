'use client'
import Topbar from '@/components/layout/Topbar'
import { useNotificationStore, NotificationType } from '@/store/notificationStore'
import { useRouter } from 'next/navigation'
import { Bell, Check, Trash2, Package, Truck, Tag, CreditCard, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const TYPE_ICONS: Record<NotificationType, React.ElementType> = {
  order: Package, delivery: Truck, promo: Tag, payment: CreditCard, system: Settings
}
const TYPE_COLORS: Record<NotificationType, string> = {
  order: '#ff6b35', delivery: '#00c896', promo: '#ff4d9e', payment: '#7c6fff', system: '#f5c842'
}
const TYPE_LABELS: Record<NotificationType, string> = {
  order: 'Orders', delivery: 'Delivery', promo: 'Promotions', payment: 'Payments', system: 'System'
}

function timeAgo(iso: string, nowMs: number) {
  const diff = (nowMs - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} days ago`
}

export default function NotificationsPage() {
  const { notifications, markRead, markAllRead, remove, clearAll, getUnreadCount } = useNotificationStore()
  const router = useRouter()
  const unread = getUnreadCount()

  const nowMs = typeof window !== 'undefined' ? Date.now() : new Date().getTime()
  const todayStr = new Date(nowMs).toDateString()
  const yesterdayStr = new Date(nowMs - 86400000).toDateString()

  const grouped = notifications.reduce((acc, n) => {
    const key = new Date(n.createdAt).toDateString()
    acc[key] = [...(acc[key] || []), n]
    return acc
  }, {} as Record<string, typeof notifications>)

  return (
    <>
      <Topbar title="Notifications" />
      <main className="p-7 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-syne font-black text-2xl text-text">Notifications</h1>
            <p className="text-text-3 text-sm mt-1">{unread > 0 ? `${unread} unread` : 'All caught up!'}</p>
          </div>
          <div className="flex gap-2">
            {unread > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-grocery/10 border border-grocery/25 text-grocery text-xs font-semibold hover:bg-grocery/15 transition-all">
                <Check size={13} /> Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/15 transition-all">
                <Trash2 size={13} /> Clear all
              </button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-bg-3 flex items-center justify-center mb-4">
              <Bell size={36} className="text-text-3" />
            </div>
            <h2 className="font-syne font-bold text-xl text-text-2 mb-2">No notifications yet</h2>
            <p className="text-text-3 text-sm">We'll let you know when something important happens</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([date, items]) => (
              <div key={date}>
                <h3 className="text-xs font-semibold text-text-3 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  {date === todayStr ? 'Today' : date === yesterdayStr ? 'Yesterday' : date}
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </h3>
                <div className="space-y-2">
                  {items.map(n => {
                    const Icon = TYPE_ICONS[n.type]
                    const color = TYPE_COLORS[n.type]
                    return (
                      <div key={n.id}
                        className={cn('flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer group',
                          !n.isRead ? 'bg-card border-white/[0.1]' : 'bg-card/50 border-white/[0.05] hover:border-white/[0.09]')}
                        onClick={() => { markRead(n.id); if (n.orderId) router.push(`/orders/${n.orderId}`) }}>
                        <div className="relative flex-shrink-0">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: `${color}20` }}>
                            {n.emoji}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: color }}>
                            <Icon size={10} className="text-white" />
                          </div>
                          {!n.isRead && <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full border-2 border-bg-2" style={{ background: color }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className={cn('text-sm font-semibold leading-tight', !n.isRead ? 'text-text' : 'text-text-2')}>{n.title}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ background: `${color}20`, color }}>
                              {TYPE_LABELS[n.type]}
                            </span>
                          </div>
                          <p className="text-xs text-text-2 leading-relaxed mb-2">{n.body}</p>
                          <p className="text-[11px] text-text-3">{timeAgo(n.createdAt, nowMs)}</p>
                        </div>
                        <button onClick={e => { e.stopPropagation(); remove(n.id) }}
                          className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-text-3 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0 self-start">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
