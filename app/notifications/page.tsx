'use client'
import Topbar from '@/components/layout/Topbar'
import { useNotifs } from '@/store/notifications'
import { useRouter } from 'next/navigation'
import { Bell, Check, Trash2, Package, Truck, Tag, CreditCard, Settings } from 'lucide-react'
import { timeAgo } from '@/lib/utils'
import type { NotifType } from '@/types'

const ICONS: Record<NotifType, React.ElementType> = { order:Package, delivery:Truck, promo:Tag, payment:CreditCard, system:Settings }
const COLORS: Record<NotifType, string> = { order:'#ff6b35', delivery:'#00c896', promo:'#ff4d9e', payment:'#7c6fff', system:'#f5c842' }
const LABELS: Record<NotifType, string> = { order:'Order', delivery:'Delivery', promo:'Promo', payment:'Payment', system:'System' }

export default function NotificationsPage() {
  const { items, markRead, markAll, remove, clear } = useNotifs()
  const router = useRouter()
  const unread = items.filter(n => !n.isRead).length

  const grouped = items.reduce((acc, n) => {
    const key = new Date(n.createdAt).toDateString()
    acc[key] = [...(acc[key]||[]), n]
    return acc
  }, {} as Record<string, typeof items>)

  const today = new Date().toDateString()
  const yesterday = new Date(Date.now()-86400000).toDateString()

  return (
    <>
      <Topbar title="Notifications" />
      <main style={{ padding:28, maxWidth:680 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:24, color:'#f0f0f8' }}>Notifications</h1>
            <p style={{ fontSize:13, color:'#6060a0', marginTop:3 }}>{unread > 0 ? `${unread} unread` : 'All caught up!'}</p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {unread > 0 && (
              <button onClick={markAll} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, background:'rgba(0,200,150,0.1)', border:'1px solid rgba(0,200,150,0.25)', color:'#00c896', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                <Check size={13} /> Mark all read
              </button>
            )}
            {items.length > 0 && (
              <button onClick={clear} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, background:'rgba(255,82,82,0.08)', border:'1px solid rgba(255,82,82,0.2)', color:'#ff5252', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                <Trash2 size={13} /> Clear all
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'#6060a0' }}>
            <div style={{ width:72, height:72, borderRadius:20, background:'#1a1a26', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <Bell size={32} style={{ opacity:0.4 }} />
            </div>
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:20, color:'#a0a0c0', fontWeight:600, marginBottom:6 }}>No notifications yet</p>
            <p style={{ fontSize:14 }}>We'll notify you when something important happens</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            {Object.entries(grouped).map(([date, notifs]) => (
              <div key={date}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                  <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.06)' }} />
                  <span style={{ fontSize:11, fontWeight:600, color:'#6060a0', textTransform:'uppercase', letterSpacing:1 }}>
                    {date===today?'Today':date===yesterday?'Yesterday':date}
                  </span>
                  <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.06)' }} />
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {notifs.map(n => {
                    const Icon = ICONS[n.type]
                    const color = COLORS[n.type]
                    return (
                      <div key={n.id}
                        onClick={() => { markRead(n.id); if(n.orderId) router.push(`/orders/${n.orderId}`) }}
                        style={{ display:'flex', gap:14, padding:'14px 16px', borderRadius:18, border:'1px solid rgba(255,255,255,0.07)', background:!n.isRead?'#16161f':'rgba(22,22,31,0.5)', cursor:n.orderId?'pointer':'default', transition:'border-color 0.2s', position:'relative' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.12)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.07)'}>
                        {/* Unread dot */}
                        {!n.isRead && <div style={{ position:'absolute', top:14, right:14, width:8, height:8, borderRadius:'50%', background:color }} />}
                        {/* Icon */}
                        <div style={{ position:'relative', flexShrink:0 }}>
                          <div style={{ width:44, height:44, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, background:`${color}18` }}>{n.emoji}</div>
                          <div style={{ position:'absolute', bottom:-3, right:-3, width:18, height:18, borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #0a0a0f' }}>
                            <Icon size={9} style={{ color:'#fff' }} />
                          </div>
                        </div>
                        {/* Content */}
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:4 }}>
                            <p style={{ fontSize:13, fontWeight:600, color:!n.isRead?'#f0f0f8':'#a0a0c0', lineHeight:1.3 }}>{n.title}</p>
                            <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20, background:`${color}18`, color, flexShrink:0 }}>{LABELS[n.type]}</span>
                          </div>
                          <p style={{ fontSize:12, color:'#a0a0c0', lineHeight:1.6, marginBottom:6 }}>{n.body}</p>
                          <p style={{ fontSize:11, color:'#6060a0' }}>{timeAgo(n.createdAt)}</p>
                        </div>
                        {/* Delete */}
                        <button onClick={e => { e.stopPropagation(); remove(n.id) }}
                          style={{ width:28, height:28, borderRadius:8, background:'transparent', border:'none', color:'#6060a0', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, alignSelf:'flex-start', transition:'color 0.15s, background 0.15s' }}
                          onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.color='#ff5252'; el.style.background='rgba(255,82,82,0.1)' }}
                          onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.color='#6060a0'; el.style.background='transparent' }}>
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
