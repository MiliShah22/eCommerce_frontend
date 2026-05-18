'use client'
import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import { ORDERS } from '@/data'
import Link from 'next/link'
import { getStatusStyle } from '@/lib/utils'
import { Package } from 'lucide-react'

const TABS = ['All', 'Active', 'Completed', 'Cancelled']
const ACTIVE_STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery']

export default function OrdersPage() {
  const [tab, setTab] = useState('All')
  const filtered = ORDERS.filter(o => {
    if (tab === 'Active') return ACTIVE_STATUSES.includes(o.status)
    if (tab === 'Completed') return o.status === 'delivered'
    if (tab === 'Cancelled') return o.status === 'cancelled'
    return true
  })
  return (
    <>
      <Topbar title="My Orders" />
      <main className="p-7">
        <div className="flex gap-1.5 bg-bg-3 p-1 rounded-xl mb-6 w-fit">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-card text-text border border-white/[0.07]' : 'text-text-2 hover:text-text'}`}>{t}</button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-text-3">
            <Package size={52} className="mx-auto mb-4 opacity-40" />
            <p className="font-syne font-semibold text-xl text-text-2">No orders here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(o => {
              const s = getStatusStyle(o.status)
              return (
                <Link key={o.id} href={`/orders/${o.id}`}
                  className="flex items-center gap-4 p-4 bg-card border border-white/[0.07] rounded-2xl hover:border-white/[0.12] transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-bg-3 flex-shrink-0">{o.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-syne font-bold text-text text-sm">{o.vendor}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${s.bg} ${s.text} ${s.border}`}>{o.status.replace('_', ' ')}</span>
                    </div>
                    <p className="text-xs text-text-2 truncate">{o.items.join(' · ')}</p>
                    <p className="text-xs text-text-3 mt-0.5">{o.date} · #{o.id}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-syne font-bold text-text">₹{o.total}</p>
                    <p className="text-xs text-text-3 mt-0.5">{o.items.length} items</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
