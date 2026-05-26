'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'
import OrderTracker from '@/components/tracking/OrderTracker'
import { ORDERS } from '@/data'
import { fmt, svcColor, STATUS_OBJ } from '@/lib/utils'
import { ArrowLeft, MapPin, CreditCard, Star, Share2, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string }
  const router  = useRouter()
  const o = ORDERS.find(x => x.id === id)

  const [showReview, setShowReview] = useState(false)
  const [rating, setRating]         = useState(0)
  const [reviewText, setReviewText] = useState('')

  if (!o) return (
    <>
      <Topbar />
      <main style={{ padding: 28, textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
        <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, color: '#a0a0c0', marginBottom: 12 }}>Order not found</h2>
        <p style={{ fontSize: 14, color: '#6060a0', marginBottom: 20 }}>No order with id "{id}"</p>
        <button onClick={() => router.push('/orders')} style={{ padding: '10px 24px', borderRadius: 12, background: '#1a1a26', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f0f8', cursor: 'pointer', fontSize: 14 }}>
          ← Back to Orders
        </button>
      </main>
    </>
  )

  const sc     = svcColor(o.service)
  const ss     = STATUS_OBJ[o.status] ?? STATUS_OBJ.pending
  const isActive = ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status)
  const card: React.CSSProperties = { background: '#16161f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 20 }

  return (
    <>
      <Topbar title={`Order #${o.id}`} />
      <main style={{ padding: 28 }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6060a0', marginBottom: 24 }}>
          <button onClick={() => router.push('/orders')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a0a0c0', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0 }}>
            <ArrowLeft size={14} /> Orders
          </button>
          <span>/</span>
          <span style={{ color: '#f0f0f8' }}>#{o.id}</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, background: `${sc}20`, flexShrink: 0 }}>{o.emoji}</div>
            <div>
              <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22, color: '#f0f0f8' }}>{o.vendor}</h1>
              <p style={{ fontSize: 12, color: '#6060a0', marginTop: 2 }}>{o.date}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!') }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: '#1a1a26', border: '1px solid rgba(255,255,255,0.08)', color: '#a0a0c0', fontSize: 12, cursor: 'pointer' }}
            >
              <Share2 size={13} /> Share
            </button>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1, background: ss.bg, color: ss.color, border: ss.border }}>
              {o.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

          {/* ── Left column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Tracker */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 17, color: '#f0f0f8' }}>Order Tracking</h2>
                {isActive && (
                  <button onClick={() => toast.success('Status refreshed')} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6060a0', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <RefreshCw size={11} /> Refresh
                  </button>
                )}
              </div>
              <OrderTracker status={o.status} simulateLive={isActive} />
              <div style={{ marginTop: 16, background: '#1a1a26', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 18 }}>🛵</span>
                <div>
                  <p style={{ fontSize: 11, color: '#6060a0', marginBottom: 2 }}>Tracking code</p>
                  <p style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#00c896' }}>{o.trackingCode}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div style={card}>
              <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 17, color: '#f0f0f8', marginBottom: 16 }}>Order Items</h2>
              {o.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{o.emoji}</span>
                    <span style={{ color: '#a0a0c0' }}>{item}</span>
                  </div>
                  <span style={{ color: '#f0f0f8', fontWeight: 500 }}>{fmt(Math.round(o.total / o.items.length))}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 13, color: '#6060a0' }}><span>Delivery fee</span><span>₹40</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 13, color: '#6060a0' }}><span>Tax (5%)</span><span>{fmt(Math.round(o.total * 0.04))}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 4px', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: '#f0f0f8' }}>Total</span>
                <span style={{ color: sc }}>{fmt(o.total)}</span>
              </div>
            </div>

            {/* Review */}
            {o.status === 'delivered' && (
              <div style={card}>
                <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 17, color: '#f0f0f8', marginBottom: 14 }}>Rate Your Experience</h2>
                {!showReview ? (
                  <button onClick={() => setShowReview(true)} style={{ width: '100%', padding: 12, borderRadius: 12, background: 'rgba(245,200,66,0.1)', border: '1px solid rgba(245,200,66,0.25)', color: '#f5c842', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Star size={16} fill="currentColor" /> Leave a Review
                  </button>
                ) : (
                  <div>
                    <p style={{ fontSize: 13, color: '#a0a0c0', marginBottom: 10 }}>How was your order?</p>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <button key={s} onClick={() => setRating(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', transform: s <= rating ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.15s', padding: 0 }}>
                          <Star size={26} fill={s <= rating ? '#f5c842' : 'none'} stroke={s <= rating ? 'none' : '#6060a0'} />
                        </button>
                      ))}
                    </div>
                    <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience…" rows={3}
                      style={{ width: '100%', background: '#1a1a26', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 14px', color: '#f0f0f8', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box', marginBottom: 12 }} />
                    <button
                      onClick={() => { if (!rating) { toast.error('Select a rating first'); return }; toast.success('Review submitted! Thank you ⭐'); setShowReview(false); setRating(0); setReviewText('') }}
                      style={{ padding: '10px 20px', borderRadius: 12, background: '#f5c842', border: 'none', color: '#0a0a0f', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                    >
                      Submit Review
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={card}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, color: '#f0f0f8', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={14} style={{ color: '#ff6b35' }} /> Delivery Address
              </h3>
              <p style={{ fontSize: 13, color: '#a0a0c0', lineHeight: 1.6 }}>{o.address}</p>
            </div>

            <div style={card}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, color: '#f0f0f8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard size={14} style={{ color: '#7c6fff' }} /> Payment
              </h3>
              {[['Method', o.paymentMethod], ['Status', '✓ Paid'], ['Amount', fmt(o.total)]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13 }}>
                  <span style={{ color: '#a0a0c0' }}>{k}</span>
                  <span style={{ fontWeight: 500, color: k === 'Status' ? '#00c896' : k === 'Amount' ? sc : '#f0f0f8' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {isActive && (
                <button onClick={() => toast.error('Cancellation request submitted')} style={{ width: '100%', padding: 11, borderRadius: 12, background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)', color: '#ff5252', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Cancel Order
                </button>
              )}
              {o.status === 'delivered' && (
                <button onClick={() => toast.success(`Refund of ${fmt(o.total)} requested. Credit in 3–5 days.`)} style={{ width: '100%', padding: 11, borderRadius: 12, background: '#1a1a26', border: '1px solid rgba(255,255,255,0.08)', color: '#a0a0c0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Request Refund
                </button>
              )}
              <Link href={`/${o.service}`} style={{ display: 'block', width: '100%', padding: 11, borderRadius: 12, background: sc, color: '#fff', fontSize: 13, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
                Order Again
              </Link>
            </div>

            <div style={{ background: '#1a1a26', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: 14, fontSize: 12, color: '#6060a0', lineHeight: 1.6 }}>
              <p style={{ fontWeight: 600, color: '#a0a0c0', marginBottom: 4 }}>Need help?</p>
              <p>Contact support with order ID <span style={{ fontFamily: 'monospace', color: '#ff6b35' }}>#{o.id}</span>. We'll resolve issues within 24 hours.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
