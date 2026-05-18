'use client'
import { useRouter } from 'next/navigation'
import type { Vendor } from '@/types'

export default function VendorCard({ vendor }: { vendor: Vendor }) {
  const router = useRouter()
  return (
    <div onClick={() => router.push(`/${vendor.service}`)}
      className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] transition-all duration-200">
      <div className="h-24 flex items-center justify-center text-4xl" style={{ background: vendor.color }}>{vendor.emoji}</div>
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-syne font-bold text-text text-sm">{vendor.name}</h3>
          {vendor.isOpen
            ? <span className="flex items-center gap-1 text-[11px] text-grocery font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-grocery inline-block" />Open</span>
            : <span className="text-[11px] text-red-400 font-semibold">Closed</span>}
        </div>
        <p className="text-xs text-text-3 mb-2">⭐ {vendor.rating} · {vendor.deliveryTime}{vendor.minOrder > 0 ? ` · Min ₹${vendor.minOrder}` : ''}</p>
        <div className="flex gap-1.5 flex-wrap">
          {vendor.tags.slice(0, 3).map(t => (
            <span key={t} className="px-2 py-0.5 rounded-full text-[11px] bg-bg-3 text-text-2 border border-white/[0.07]">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
