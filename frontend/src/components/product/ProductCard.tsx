'use client'
import Link from 'next/link'
import { Heart, Plus, Check, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice, getServiceColor, cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

const BADGE_STYLES: Record<string, string> = {
  veg: 'bg-grocery/20 text-grocery border border-grocery/30',
  organic: 'bg-grocery/20 text-grocery border border-grocery/30',
  new: 'bg-laundry/20 text-laundry border border-laundry/30',
  sale: 'bg-clothing/20 text-clothing border border-clothing/30',
  popular: 'bg-laundry/20 text-laundry border border-laundry/30',
  premium: 'bg-laundry/20 text-laundry border border-laundry/30',
  seasonal: 'bg-clothing/20 text-clothing border border-clothing/30',
  combo: 'bg-grocery/20 text-grocery border border-grocery/30',
  trending: 'bg-clothing/20 text-clothing border border-clothing/30',
  bestseller: 'bg-food/20 text-food border border-food/30',
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, getItemById } = useCartStore()
  const { has, toggle } = useWishlistStore()
  const inCart = getItemById(product.id)
  const inWishlist = has(product.id)
  const serviceColor = getServiceColor(product.service)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      service: product.service,
      vendorId: product.vendorId,
      vendorName: product.vendor,
    })
    toast.success(`${product.name} added to cart`, {
      style: { background: '#1e1e2e', color: '#f0f0f8', border: '1px solid rgba(255,255,255,0.07)', borderLeft: `3px solid ${serviceColor}` },
      icon: product.emoji,
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(product.id)
    toast.success(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist', {
      style: { background: '#1e1e2e', color: '#f0f0f8', border: '1px solid rgba(255,255,255,0.07)' },
      icon: inWishlist ? '💔' : '❤️',
    })
  }

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null

  return (
    <Link href={`/product/${product.id}`}
      className="group bg-card border border-white/[0.07] rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] block">
      {/* Image area */}
      <div className={`relative h-40 flex items-center justify-center text-5xl bg-gradient-to-br`}
        style={{ background: `linear-gradient(135deg, ${serviceColor}18, ${serviceColor}06)` }}>
        <span className="group-hover:scale-110 transition-transform duration-300 select-none">{product.emoji}</span>
        {/* Badge */}
        {product.badge && BADGE_STYLES[product.badge] && (
          <span className={`absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${BADGE_STYLES[product.badge]}`}>
            {product.badge === 'veg' ? '🥬 Veg' : product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
          </span>
        )}
        {discount && (
          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-clothing/20 text-clothing border border-clothing/30">
            -{discount}%
          </span>
        )}
        {/* Wishlist */}
        <button onClick={handleWishlist}
          className={cn('absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center border transition-all',
            inWishlist
              ? 'bg-clothing/15 border-clothing/30 text-clothing'
              : 'bg-black/40 border-white/10 text-text-2 opacity-0 group-hover:opacity-100 hover:border-clothing/30 hover:text-clothing')}>
          <Heart size={12} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
      </div>
      {/* Body */}
      <div className="p-3.5">
        <h3 className="font-syne font-semibold text-text text-sm leading-tight mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-text-3 mb-2 line-clamp-1">{product.vendor}{product.unit ? ` · ${product.unit}` : ''}</p>
        <div className="flex items-center gap-1 mb-3">
          <Star size={11} fill="#f5c842" stroke="none" />
          <span className="text-xs font-medium text-gold">{product.rating}</span>
          <span className="text-xs text-text-3">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-syne font-bold text-base" style={{ color: serviceColor }}>{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-text-3 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button onClick={handleAddToCart}
            className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 text-white font-bold',
              inCart ? 'scale-110' : 'hover:scale-105 active:scale-95')}
            style={{ background: serviceColor }}>
            {inCart ? <Check size={13} /> : <Plus size={13} />}
          </button>
        </div>
      </div>
    </Link>
  )
}
