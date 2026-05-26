'use client'
import Link from 'next/link'
import { Heart, Plus, Check, Star } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { fmt, svcColor } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

const BADGES: Record<string, { bg: string; color: string; text: string }> = {
  veg:        { bg: 'rgba(0,200,150,0.15)',   color: '#00c896', text: '🥬 Veg' },
  organic:    { bg: 'rgba(0,200,150,0.15)',   color: '#00c896', text: 'Organic' },
  new:        { bg: 'rgba(124,111,255,0.15)', color: '#7c6fff', text: 'New' },
  sale:       { bg: 'rgba(255,77,158,0.15)',  color: '#ff4d9e', text: 'Sale' },
  popular:    { bg: 'rgba(124,111,255,0.15)', color: '#7c6fff', text: 'Popular' },
  premium:    { bg: 'rgba(124,111,255,0.15)', color: '#7c6fff', text: 'Premium' },
  seasonal:   { bg: 'rgba(255,77,158,0.15)',  color: '#ff4d9e', text: 'Seasonal' },
  combo:      { bg: 'rgba(0,200,150,0.15)',   color: '#00c896', text: 'Combo' },
  trending:   { bg: 'rgba(255,77,158,0.15)',  color: '#ff4d9e', text: 'Trending' },
  bestseller: { bg: 'rgba(255,107,53,0.15)',  color: '#ff6b35', text: 'Bestseller' },
}

export default function ProductCard({ product: p }: { product: Product }) {
  // Read plain state slices — never call methods inside selectors
  const addItem  = useCart(s => s.addItem)
  const cartItems = useCart(s => s.items)
  const wishIds  = useWishlist(s => s.ids)
  const toggleWish = useWishlist(s => s.toggle)

  const inCart = cartItems.some(i => i.productId === p.id)
  const inWish = wishIds.includes(p.id)
  const color  = svcColor(p.service)
  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0
  const badge = p.badge ? BADGES[p.badge] : null

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ productId: p.id, name: p.name, price: p.price, emoji: p.emoji, service: p.service, vendorId: p.vendorId, vendorName: p.vendor })
    toast.success(`${p.emoji} ${p.name} added!`, {
      style: { background: '#1e1e2e', color: '#f0f0f8', border: '1px solid rgba(255,255,255,0.08)', borderLeft: `3px solid ${color}` },
    })
  }

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWish(p.id)
    toast.success(inWish ? '💔 Removed from wishlist' : '❤️ Saved to wishlist', {
      style: { background: '#1e1e2e', color: '#f0f0f8', border: '1px solid rgba(255,255,255,0.08)' },
    })
  }

  return (
    <Link href={`/product/${p.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{ background: '#16161f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.borderColor = 'rgba(255,255,255,0.13)'; el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)' }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.boxShadow = 'none' }}
      >
        {/* Image */}
        <div style={{ height: 152, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, position: 'relative', background: `linear-gradient(135deg,${color}18,${color}06)` }}>
          <span style={{ userSelect: 'none' }}>{p.emoji}</span>
          {badge && (
            <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: badge.bg, color: badge.color, border: `1px solid ${badge.color}40` }}>
              {badge.text}
            </span>
          )}
          {!badge && discount > 0 && (
            <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: 'rgba(255,77,158,0.15)', color: '#ff4d9e', border: '1px solid rgba(255,77,158,0.3)' }}>
              -{discount}%
            </span>
          )}
          <button
            onClick={handleWish}
            style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: '50%', background: inWish ? 'rgba(255,77,158,0.2)' : 'rgba(0,0,0,0.4)', border: `1px solid ${inWish ? 'rgba(255,77,158,0.4)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: inWish ? '#ff4d9e' : '#a0a0c0', transition: 'all 0.15s' }}
          >
            <Heart size={12} fill={inWish ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '12px 14px 14px' }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 14, color: '#f0f0f8', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
          <div style={{ fontSize: 11, color: '#6060a0', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.vendor}{p.unit ? ` · ${p.unit}` : ''}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 10 }}>
            <Star size={11} fill="#f5c842" stroke="none" />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#f5c842' }}>{p.rating}</span>
            <span style={{ fontSize: 11, color: '#6060a0' }}>({p.reviews})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color }}>{fmt(p.price)}</span>
              {p.originalPrice && <span style={{ fontSize: 11, color: '#6060a0', textDecoration: 'line-through' }}>{fmt(p.originalPrice)}</span>}
            </div>
            <button
              onClick={handleAdd}
              style={{ width: 28, height: 28, borderRadius: 9, background: color, border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
            >
              {inCart ? <Check size={13} /> : <Plus size={13} />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
