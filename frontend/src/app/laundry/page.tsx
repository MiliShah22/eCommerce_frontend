'use client'
import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import ProductCard from '@/components/product/ProductCard'
import { PRODUCTS, VENDORS } from '@/data'
import { Check, CalendarDays, Clock, MapPin, ChevronRight, Star } from 'lucide-react'
import toast from 'react-hot-toast'

const LAUNDRY_SERVICES = [
  { id:'ls1', emoji:'👕', name:'Wash & Fold', desc:'Fresh, fluffy clothes returned within 24 hours.', price:'₹59', unit:'/kg', time:'24 hrs', popular:true, color:'#7c6fff' },
  { id:'ls2', emoji:'🪄', name:'Steam Ironing', desc:'Professional steam ironing for crisp, wrinkle-free garments.', price:'₹25', unit:'/piece', time:'12 hrs', popular:false, color:'#9d90ff' },
  { id:'ls3', emoji:'🥼', name:'Dry Cleaning', desc:'Expert dry cleaning for suits, silk & delicate fabrics.', price:'₹149', unit:'/piece', time:'48 hrs', popular:false, color:'#7c6fff' },
  { id:'ls4', emoji:'✨', name:'Wash + Iron Combo', desc:'Full wash, dry and professional steam ironing.', price:'₹79', unit:'/kg', time:'36 hrs', popular:true, color:'#b06fff' },
  { id:'ls5', emoji:'👟', name:'Sneaker Cleaning', desc:'Deep clean & restoration for all types of sneakers.', price:'₹249', unit:'/pair', time:'48 hrs', popular:false, color:'#7c6fff' },
  { id:'ls6', emoji:'🛋️', name:'Home Textiles', desc:'Sofas, carpets, curtains using industrial equipment.', price:'₹799', unit:'/piece', time:'72 hrs', popular:false, color:'#9d90ff' },
]

const PICKUP_SLOTS = ['9:00 AM – 11:00 AM','11:00 AM – 1:00 PM','2:00 PM – 4:00 PM','4:00 PM – 7:00 PM']

function tomorrow() {
  const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().slice(0,10)
}
function dayAfter() {
  const d = new Date(); d.setDate(d.getDate()+2); return d.toISOString().slice(0,10)
}

export default function LaundryPage() {
  const [selected, setSelected] = useState<string|null>(null)
  const [pickupDate, setPickupDate] = useState(tomorrow())
  const [pickupSlot, setPickupSlot] = useState(PICKUP_SLOTS[0])
  const [deliveryDate, setDeliveryDate] = useState(dayAfter())
  const [deliverySlot, setDeliverySlot] = useState(PICKUP_SLOTS[0])
  const [vendor, setVendor] = useState('v7')
  const [instructions, setInstructions] = useState('')
  const [booked, setBooked] = useState(false)

  const handleBook = () => {
    if (!selected) { toast.error('Please select a service first'); return }
    setBooked(true)
    toast.success('🧺 Pickup scheduled! Confirmation SMS sent.', {
      style:{ background:'#1e1e2e', color:'#f0f0f8', border:'1px solid rgba(124,111,255,.35)' }
    })
  }

  const selectedService = LAUNDRY_SERVICES.find(s => s.id === selected)

  return (
    <>
      <Topbar title="Laundry Services" />
      <main className="p-7">
        {/* Hero */}
        <div className="relative rounded-3xl p-8 mb-8 overflow-hidden min-h-[180px] flex flex-col justify-end"
          style={{ background:'linear-gradient(135deg,rgba(124,111,255,0.2),rgba(157,144,255,0.06))' }}>
          <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at 80% 50%,rgba(124,111,255,0.25) 0%,transparent 65%)' }} />
          <div className="relative z-10">
            <p className="text-xs font-semibold text-laundry mb-2 uppercase tracking-widest">🧺 Laundry & Dry Cleaning</p>
            <h1 className="font-syne font-black text-3xl text-text mb-2">Clothes in,<br /><span className="text-laundry">fresh out</span></h1>
            <p className="text-text-2 text-sm max-w-md">Schedule a pickup, we clean & deliver. Free pickup, tracked doorstep delivery.</p>
            <button onClick={() => document.getElementById('schedule-form')?.scrollIntoView({behavior:'smooth'})}
              className="mt-4 px-5 py-2.5 rounded-xl bg-laundry text-white text-sm font-semibold flex items-center gap-2 w-fit hover:brightness-110 transition-all">
              <CalendarDays size={16} /> Schedule Pickup
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[['4.9★','Customer Rating'],['24hr','Fastest Turnaround'],['Free','Pickup & Delivery'],['100%','Satisfaction Guarantee']].map(([v,l]) => (
            <div key={l} className="bg-card border border-white/[0.07] rounded-2xl p-4 text-center">
              <div className="font-syne font-black text-2xl text-laundry mb-1">{v}</div>
              <div className="text-xs text-text-3">{l}</div>
            </div>
          ))}
        </div>

        {/* Service selection */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-bold text-xl text-text">Choose a Service</h2>
            {selected && <span className="text-xs text-laundry font-semibold">✓ {selectedService?.name} selected</span>}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {LAUNDRY_SERVICES.map(svc => (
              <div key={svc.id} onClick={() => setSelected(svc.id === selected ? null : svc.id)}
                className="relative rounded-2xl p-5 cursor-pointer transition-all border"
                style={{ background: selected===svc.id ? 'rgba(124,111,255,0.1)' : '#16161f', borderColor: selected===svc.id ? 'rgba(124,111,255,0.5)' : 'rgba(255,255,255,0.07)' }}>
                {selected===svc.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-laundry flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                {svc.popular && (
                  <div className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-laundry/20 text-laundry border border-laundry/30">⭐ Popular</div>
                )}
                <div className="text-3xl mb-3 mt-2">{svc.emoji}</div>
                <h3 className="font-syne font-bold text-text text-sm mb-1.5">{svc.name}</h3>
                <p className="text-xs text-text-2 leading-relaxed mb-3">{svc.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-syne font-bold text-laundry">{svc.price}<span className="text-xs font-normal text-text-3">{svc.unit}</span></span>
                  <span className="text-xs text-text-3 flex items-center gap-1"><Clock size={11} /> {svc.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vendors */}
        <section className="mb-8">
          <h2 className="font-syne font-bold text-xl text-text mb-4">Our Laundry Partners</h2>
          <div className="grid grid-cols-2 gap-4">
            {(VENDORS.laundry || []).map(v => (
              <div key={v.id} onClick={() => setVendor(v.id)}
                className="flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all"
                style={{ background: vendor===v.id ? 'rgba(124,111,255,0.08)' : '#16161f', borderColor: vendor===v.id ? 'rgba(124,111,255,0.4)' : 'rgba(255,255,255,0.07)' }}>
                <div className="text-3xl w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: v.color }}>{v.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-syne font-bold text-text text-sm">{v.name}</h3>
                    {vendor===v.id && <Check size={13} className="text-laundry" />}
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <Star size={11} fill="#f5c842" stroke="none" />
                    <span className="text-xs text-gold font-semibold">{v.rating}</span>
                    <span className="text-xs text-text-3">· {v.deliveryTime}</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {v.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-bg-3 text-text-3 border border-white/[0.07]">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Schedule form */}
        <section id="schedule-form" className="mb-8">
          <h2 className="font-syne font-bold text-xl text-text mb-4">📅 Schedule Pickup & Delivery</h2>
          {booked ? (
            <div className="bg-card border border-laundry/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-laundry/20 border border-laundry/30 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-laundry" />
              </div>
              <h3 className="font-syne font-bold text-2xl text-text mb-2">Pickup Scheduled! 🎉</h3>
              <p className="text-text-2 text-sm mb-4">Our partner will arrive at your doorstep on <strong className="text-laundry">{pickupDate}</strong> between <strong className="text-laundry">{pickupSlot}</strong>.</p>
              <div className="bg-bg-3 rounded-xl p-4 text-sm space-y-2 text-left max-w-sm mx-auto mb-5">
                <div className="flex justify-between text-text-2"><span>Service</span><span className="text-text font-medium">{selectedService?.name || '—'}</span></div>
                <div className="flex justify-between text-text-2"><span>Vendor</span><span className="text-text font-medium">{VENDORS.laundry?.find(v => v.id === vendor)?.name}</span></div>
                <div className="flex justify-between text-text-2"><span>Pickup</span><span className="text-text font-medium">{pickupDate} · {pickupSlot}</span></div>
                <div className="flex justify-between text-text-2"><span>Delivery</span><span className="text-text font-medium">{deliveryDate} · {deliverySlot}</span></div>
              </div>
              <button onClick={() => setBooked(false)} className="px-6 py-2.5 rounded-xl bg-bg-3 border border-white/[0.07] text-text text-sm hover:bg-bg-4 transition-all">Schedule Another</button>
            </div>
          ) : (
            <div className="bg-card border border-white/[0.07] rounded-2xl p-6 max-w-2xl">
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Pickup Date</label>
                  <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} min={tomorrow()}
                    className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-white/20 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Pickup Time Slot</label>
                  <select value={pickupSlot} onChange={e => setPickupSlot(e.target.value)}
                    className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-white/20 transition-colors">
                    {PICKUP_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Delivery Date</label>
                  <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} min={tomorrow()}
                    className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-white/20 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Delivery Time Slot</label>
                  <select value={deliverySlot} onChange={e => setDeliverySlot(e.target.value)}
                    className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-white/20 transition-colors">
                    {PICKUP_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-5">
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Special Instructions (optional)</label>
                <textarea value={instructions} onChange={e => setInstructions(e.target.value)}
                  placeholder="E.g. Handle delicate fabrics with care, separate whites, use fragrance-free detergent…"
                  rows={3} className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text placeholder-text-3 outline-none focus:border-white/20 transition-colors resize-none" />
              </div>
              <div className="flex items-center gap-3 bg-bg-3 rounded-xl p-3 border border-white/[0.07] mb-5">
                <MapPin size={16} className="text-laundry flex-shrink-0" />
                <div className="flex-1 text-xs text-text-2">Pickup from: <span className="text-text font-medium">42, Alkapuri Society, Race Course Circle, Vadodara</span></div>
                <button className="text-xs text-laundry hover:underline">Change</button>
              </div>
              <button onClick={handleBook}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:brightness-110"
                style={{ background: selected ? '#7c6fff' : '#3a3a5a', cursor: selected ? 'pointer' : 'not-allowed' }}>
                <CalendarDays size={16} />
                {selected ? `Schedule ${selectedService?.name} Pickup` : 'Select a service above first'}
              </button>
            </div>
          )}
        </section>

        {/* Products */}
        <section>
          <h2 className="font-syne font-bold text-xl text-text mb-4">All Laundry Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PRODUCTS.laundry.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </main>
    </>
  )
}
