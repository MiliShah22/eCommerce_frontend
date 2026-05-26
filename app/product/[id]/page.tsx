'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'
import ProductCard from '@/components/product/ProductCard'
import { ALL_PRODUCTS, PRODUCTS } from '@/data'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { fmt, svcColor } from '@/lib/utils'
import { ArrowLeft, Star, Heart, Plus, Minus, ShoppingCart, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string }
  const router  = useRouter()

  // Read plain state only — no method calls in selectors
  const addItem   = useCart(s => s.addItem)
  const cartItems = useCart(s => s.items)
  const wishIds   = useWishlist(s => s.ids)
  const toggleWish = useWishlist(s => s.toggle)

  const [qty, setQty]       = useState(1)
  const [selColor, setColor] = useState('')
  const [selSize, setSize]   = useState('')
  const [reviewRating, setReviewRating]   = useState(0)
  const [reviewText, setReviewText]       = useState('')
  const [showReviewForm, setShowReview]   = useState(false)

  const p      = ALL_PRODUCTS.find(x => x.id === id)
  const inCart = cartItems.some(i => i.productId === id)
  const inWish = wishIds.includes(id)

  if (!p) return (
    <>
      <Topbar />
      <main style={{ padding: 28, textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
        <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, color: '#a0a0c0', marginBottom: 12 }}>Product not found</h2>
        <p style={{ fontSize: 14, color: '#6060a0', marginBottom: 20 }}>No product with id "{id}"</p>
        <button
          onClick={() => router.back()}
          style={{ padding: '10px 24px', borderRadius: 12, background: '#1a1a26', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f0f8', cursor: 'pointer', fontSize: 14 }}
        >
          ← Go Back
        </button>
      </main>
    </>
  )

  const clr      = svcColor(p.service)
  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0
  const related  = (PRODUCTS[p.service] ?? []).filter(x => x.id !== p.id).slice(0, 4)

  const handleAdd = () => {
    const variant = (selColor || selSize) ? { color: selColor || undefined, size: selSize || undefined } : undefined
    for (let i = 0; i < qty; i++) {
      addItem({ productId: p.id, name: p.name, price: p.price, emoji: p.emoji, service: p.service, vendorId: p.vendorId, vendorName: p.vendor }, variant)
    }
    toast.success(`${p.emoji} ${qty}× ${p.name} added to cart!`, {
      style: { borderLeft: `3px solid ${clr}`, background: '#1e1e2e', color: '#f0f0f8' },
    })
  }

  const S: Record<string, React.CSSProperties> = {
    card:  { background: '#16161f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 20 },
    label: { fontSize: 11, fontWeight: 600, color: '#a0a0c0', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 },
  }

  return (
    <>
      <Topbar title={p.name} />
      <main style={{ padding: 28 }}>

        {/* Back */}
        <button
          onClick={() => router.back()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#a0a0c0', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24, padding: 0 }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 36, marginBottom: 48, alignItems: 'start' }}>

          {/* ── Left: Image ── */}
          <div>
            <div style={{ borderRadius: 20, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100, border: '1px solid rgba(255,255,255,0.07)', marginBottom: 12, position: 'relative', background: `linear-gradient(135deg,${clr}18,${clr}06)` }}>
              <span style={{ userSelect: 'none' }}>{p.emoji}</span>
              {discount > 0 && (
                <span style={{ position: 'absolute', top: 14, left: 14, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: 'rgba(255,77,158,0.18)', color: '#ff4d9e', border: '1px solid rgba(255,77,158,0.3)' }}>
                  -{discount}% OFF
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 64, height: 64, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, background: '#1a1a26', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                  {p.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: clr, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>{p.category}</p>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, color: '#f0f0f8', marginBottom: 6, lineHeight: 1.2 }}>{p.name}</h1>
            <p style={{ color: '#a0a0c0', fontSize: 14, marginBottom: 14 }}>by {p.vendor}</p>

            {/* Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
              <div style={{ display: 'flex' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={15} fill={s <= Math.round(p.rating) ? '#f5c842' : 'none'} stroke={s <= Math.round(p.rating) ? 'none' : '#6060a0'} />
                ))}
              </div>
              <span style={{ fontWeight: 700, color: '#f5c842', fontSize: 14 }}>{p.rating}</span>
              <span style={{ color: '#6060a0', fontSize: 13 }}>({p.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
              <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 36, color: clr }}>{fmt(p.price)}</span>
              {p.originalPrice && <span style={{ fontSize: 18, color: '#6060a0', textDecoration: 'line-through' }}>{fmt(p.originalPrice)}</span>}
              {discount > 0 && <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(255,77,158,0.15)', color: '#ff4d9e' }}>Save {discount}%</span>}
            </div>

            {/* Description */}
            {p.description && (
              <p style={{ fontSize: 14, color: '#a0a0c0', lineHeight: 1.7, marginBottom: 20, paddingLeft: 12, borderLeft: `2px solid ${clr}` }}>
                {p.description}
              </p>
            )}

            {/* Veg badge */}
            {p.isVeg !== undefined && (
              <div style={{ marginBottom: 16 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: p.isVeg ? 'rgba(0,200,150,0.15)' : 'rgba(255,107,53,0.15)', color: p.isVeg ? '#00c896' : '#ff6b35', border: `1px solid ${p.isVeg ? 'rgba(0,200,150,0.3)' : 'rgba(255,107,53,0.3)'}` }}>
                  {p.isVeg ? '🥬 Vegetarian' : '🍗 Non-Vegetarian'}
                </span>
              </div>
            )}

            {/* Unit */}
            {p.unit && <p style={{ fontSize: 14, color: '#a0a0c0', marginBottom: 16 }}>Unit: <strong style={{ color: '#f0f0f8' }}>{p.unit}</strong></p>}

            {/* Colors */}
            {p.colors && p.colors.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <span style={S.label}>Color</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {p.colors.map(c => (
                    <button key={c} onClick={() => setColor(c)}
                      style={{ padding: '6px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: `1px solid ${selColor === c ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'}`, background: selColor === c ? '#22223a' : '#1a1a26', color: selColor === c ? '#f0f0f8' : '#a0a0c0', transition: 'all 0.15s' }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {p.sizes && p.sizes.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <span style={S.label}>Size</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {p.sizes.map(s => (
                    <button key={s} onClick={() => setSize(s)}
                      style={{ width: 42, height: 42, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: `1px solid ${selSize === s ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'}`, background: selSize === s ? '#22223a' : '#1a1a26', color: selSize === s ? '#f0f0f8' : '#a0a0c0', transition: 'all 0.15s' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add to Cart + Wishlist */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1a1a26', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 4 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, borderRadius: 9, background: '#22223a', border: 'none', color: '#a0a0c0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Minus size={14} />
                </button>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: '#f0f0f8', width: 28, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 36, height: 36, borderRadius: 9, background: '#22223a', border: 'none', color: '#a0a0c0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                style={{ flex: 1, padding: '12px 20px', borderRadius: 12, background: clr, border: 'none', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.filter = 'brightness(1.12)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'}
              >
                {inCart ? <Check size={17} /> : <ShoppingCart size={17} />}
                {inCart ? `In Cart — Add ${qty} more` : `Add ${qty} to Cart`} — {fmt(p.price * qty)}
              </button>
              <button
                onClick={() => toggleWish(p.id)}
                style={{ width: 46, height: 46, borderRadius: 12, background: inWish ? 'rgba(255,77,158,0.15)' : '#1a1a26', border: `1px solid ${inWish ? 'rgba(255,77,158,0.3)' : 'rgba(255,255,255,0.08)'}`, color: inWish ? '#ff4d9e' : '#a0a0c0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
              >
                <Heart size={19} fill={inWish ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Info table */}
            <div style={{ background: '#1a1a26', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 16 }}>
              {([
                ['Vendor', p.vendor],
                ['Category', p.category],
                ['Rating', `⭐ ${p.rating} / 5 (${p.reviews} reviews)`],
                ...(p.unit ? [['Unit', p.unit]] : []),
                ['Availability', '✓ In Stock'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13 }}>
                  <span style={{ color: '#a0a0c0' }}>{k}</span>
                  <span style={{ color: '#f0f0f8', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Reviews ── */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 20, color: '#f0f0f8' }}>Customer Reviews</h2>
            <button
              onClick={() => setShowReview(v => !v)}
              style={{ padding: '8px 16px', borderRadius: 12, background: 'rgba(245,200,66,0.1)', border: '1px solid rgba(245,200,66,0.25)', color: '#f5c842', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              {showReviewForm ? 'Cancel' : '+ Write Review'}
            </button>
          </div>

          {showReviewForm && (
            <div style={{ ...S.card, marginBottom: 16 }}>
              <p style={{ fontSize: 14, color: '#a0a0c0', marginBottom: 10 }}>Your Rating</p>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setReviewRating(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, transform: s <= reviewRating ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.15s' }}>
                    <Star size={24} fill={s <= reviewRating ? '#f5c842' : 'none'} stroke={s <= reviewRating ? 'none' : '#6060a0'} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Share your experience…"
                rows={3}
                style={{ width: '100%', background: '#1a1a26', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 14px', color: '#f0f0f8', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box', marginBottom: 12 }}
              />
              <button
                onClick={() => {
                  if (!reviewRating) { toast.error('Please select a rating'); return }
                  toast.success('Review submitted! Thank you ⭐')
                  setShowReview(false); setReviewRating(0); setReviewText('')
                }}
                style={{ padding: '10px 20px', borderRadius: 12, background: '#f5c842', border: 'none', color: '#0a0a0f', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              >
                Submit Review
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { u: 'Priya S.',  r: 5, t: 'Excellent quality!',    b: 'Really loved it. Quick delivery and exactly as described. Will definitely order again!', d: '2 days ago' },
              { u: 'Rajan M.', r: 4, t: 'Good value for money',   b: 'Pretty good for the price. Packaging was secure and the product matches the photos.', d: '1 week ago' },
              { u: 'Amit K.',  r: 5, t: 'Absolutely fantastic',   b: "One of the best purchases I've made. Highly recommended!", d: '2 weeks ago' },
              { u: 'Meera J.', r: 4, t: 'Happy with my purchase', b: 'Good quality overall. Delivery was slightly late but the product itself is great.', d: '3 weeks ago' },
            ].map((rev, i) => (
              <div key={i} style={S.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#22223a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, color: '#f0f0f8', flexShrink: 0 }}>{rev.u[0]}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f8' }}>{rev.u}</p>
                    <p style={{ fontSize: 11, color: '#6060a0' }}>{rev.d}</p>
                  </div>
                  <div style={{ display: 'flex' }}>{[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= rev.r ? '#f5c842' : 'none'} stroke={s <= rev.r ? 'none' : '#6060a0'} />)}</div>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f8', marginBottom: 4 }}>{rev.t}</p>
                <p style={{ fontSize: 12, color: '#a0a0c0', lineHeight: 1.6 }}>{rev.b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 20, color: '#f0f0f8', marginBottom: 16 }}>You May Also Like</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {related.map(rp => <ProductCard key={rp.id} product={rp} />)}
            </div>
          </section>
        )}

      </main>
    </>
  )
}
