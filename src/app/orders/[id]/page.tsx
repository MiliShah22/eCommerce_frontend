'use client'
import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'
import OrderTracker from '@/components/tracking/OrderTracker'
import { ORDERS } from '@/data'
import { getStatusStyle } from '@/lib/utils'
import { ArrowLeft, MapPin, CreditCard, Star, Share2, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const order = ORDERS.find(o => o.id === id)
  const [showReview, setShowReview] = useState(false)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')

  if (!order) return (
    <>
      <Topbar />
      <main className="p-7 text-center py-20">
        <div className="text-5xl mb-4">📭</div>
        <p className="font-syne font-bold text-xl text-text-2 mb-4">Order not found</p>
        <button onClick={() => router.push('/orders')} className="px-5 py-2.5 rounded-xl bg-bg-3 text-text text-sm border border-white/10 hover:bg-bg-4 transition-all">Go Back</button>
      </main>
    </>
  )

  const s = getStatusStyle(order.status)
  const isActive = ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status)
  const svcColor: Record<string, string> = { food: '#ff6b35', grocery: '#00c896', laundry: '#7c6fff', clothing: '#ff4d9e' }

  const handleRefund = () => toast.success('Refund request submitted. ₹' + order.total + ' will be credited in 3-5 business days.')
  const handleShare = () => { navigator.clipboard?.writeText(window.location.href); toast.success('Order link copied!') }

  return (
    <>
      <Topbar title={`Order #${order.id}`} />
      <main className="p-7">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-3 mb-6">
          <button onClick={() => router.push('/orders')} className="flex items-center gap-1.5 hover:text-text transition-colors">
            <ArrowLeft size={14} /> Orders
          </button>
          <span>/</span>
          <span className="text-text">#{order.id}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${svcColor[order.service]}20` }}>{order.emoji}</div>
            <div>
              <h1 className="font-syne font-black text-2xl text-text">{order.vendor}</h1>
              <p className="text-text-3 text-sm">{order.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-3 border border-white/[0.07] text-text-2 text-xs hover:bg-bg-4 transition-all">
              <Share2 size={13} /> Share
            </button>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border uppercase tracking-wide ${s.bg} ${s.text} ${s.border}`}>
              {order.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left */}
          <div className="space-y-5">
            {/* Live Tracker */}
            <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-syne font-bold text-lg text-text">Order Tracking</h2>
                {isActive && (
                  <button onClick={() => toast.success('Status refreshed')} className="flex items-center gap-1.5 text-xs text-text-3 hover:text-grocery transition-colors">
                    <RefreshCw size={12} /> Refresh
                  </button>
                )}
              </div>
              <OrderTracker status={order.status} orderId={order.id} simulateLive={isActive} />
              <div className="mt-4 bg-bg-3 rounded-xl p-3.5 flex items-center gap-3 border border-white/[0.05]">
                <span className="text-xl">🛵</span>
                <div>
                  <p className="text-xs text-text-3">Tracking code</p>
                  <p className="font-mono text-sm font-bold text-grocery">{order.trackingCode}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
              <h2 className="font-syne font-bold text-lg text-text mb-4">Order Items</h2>
              <div className="divide-y divide-white/[0.05]">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3.5 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{order.emoji}</span>
                      <span className="text-text-2">{item}</span>
                    </div>
                    <span className="text-text font-medium">₹{Math.round(order.total / order.items.length)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-3.5 text-sm text-text-2"><span>Delivery fee</span><span>₹40</span></div>
                <div className="flex justify-between py-3.5 text-sm text-text-2"><span>Tax (5%)</span><span>₹{Math.round(order.total * 0.04)}</span></div>
                <div className="flex justify-between py-3.5 font-syne font-black text-lg">
                  <span className="text-text">Total</span>
                  <span style={{ color: svcColor[order.service] }}>₹{order.total}</span>
                </div>
              </div>
            </div>

            {/* Review section */}
            {order.status === 'delivered' && (
              <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
                <h2 className="font-syne font-bold text-lg text-text mb-4">Rate Your Experience</h2>
                {!showReview ? (
                  <button onClick={() => setShowReview(true)}
                    className="w-full py-3 rounded-xl bg-gold/10 border border-gold/25 text-gold font-semibold text-sm hover:bg-gold/15 transition-all flex items-center justify-center gap-2">
                    <Star size={16} fill="currentColor" /> Leave a Review
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-text-2 mb-3">How was your order?</p>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(s => (
                          <button key={s} onClick={() => setRating(s)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110">
                            <Star size={22} fill={s <= rating ? '#f5c842' : 'none'} stroke={s <= rating ? 'none' : '#6060a0'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                      placeholder="Share your experience…" rows={3}
                      className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text placeholder-text-3 outline-none focus:border-white/20 resize-none transition-colors" />
                    <button onClick={() => { toast.success('Review submitted! Thank you ⭐'); setShowReview(false) }}
                      className="w-full py-3 rounded-xl bg-gold text-bg font-bold text-sm hover:brightness-105 transition-all">
                      Submit Review
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="bg-card border border-white/[0.07] rounded-2xl p-5">
              <h3 className="font-syne font-bold text-text mb-3 flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-food" /> Delivery Address
              </h3>
              <p className="text-sm text-text-2 leading-relaxed">{order.address}</p>
            </div>

            <div className="bg-card border border-white/[0.07] rounded-2xl p-5">
              <h3 className="font-syne font-bold text-text mb-4 flex items-center gap-2 text-sm">
                <CreditCard size={14} className="text-laundry" /> Payment Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-text-2"><span>Method</span><span className="text-text font-medium">{order.paymentMethod}</span></div>
                <div className="flex justify-between text-text-2"><span>Status</span><span className="text-grocery font-semibold">✓ Paid</span></div>
                <div className="flex justify-between text-text-2"><span>Transaction</span><span className="font-mono text-text text-xs">TXN{order.id.replace('ORD-', '').replace('-', '')}</span></div>
                <div className="flex justify-between font-syne font-bold text-base pt-2 border-t border-white/[0.07]">
                  <span>Total</span><span style={{ color: svcColor[order.service] }}>₹{order.total}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-white/[0.07] rounded-2xl p-5">
              <h3 className="font-syne font-bold text-text mb-3 text-sm">Actions</h3>
              <div className="space-y-2">
                {isActive && (
                  <button onClick={() => toast.error('Cancellation requested')}
                    className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/15 transition-all">
                    Cancel Order
                  </button>
                )}
                {order.status === 'delivered' && (
                  <button onClick={handleRefund}
                    className="w-full py-2.5 rounded-xl bg-bg-3 border border-white/[0.07] text-text-2 text-sm font-medium hover:bg-bg-4 transition-all">
                    Request Refund
                  </button>
                )}
                <Link href={`/${order.service}`}
                  className="block w-full py-2.5 rounded-xl text-center font-semibold text-sm text-white transition-all hover:brightness-110"
                  style={{ background: svcColor[order.service] }}>
                  Order Again
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="bg-bg-3 border border-white/[0.05] rounded-2xl p-4 text-xs text-text-3 leading-relaxed">
              <p className="font-semibold text-text-2 mb-1">Need help?</p>
              <p>Contact support with order ID <span className="font-mono text-food">#{order.id}</span> and we'll resolve any issues within 24 hours.</p>
              <button className="mt-2 text-laundry hover:underline">Chat with Support →</button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
