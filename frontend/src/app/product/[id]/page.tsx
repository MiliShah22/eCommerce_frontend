'use client'
import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Star, Plus, Minus, ShoppingCart, Check } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import ProductCard from '@/components/product/ProductCard'
import { ALL_PRODUCTS, PRODUCTS } from '@/data'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice, getServiceColor } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const product = ALL_PRODUCTS.find(p => p.id === id)
  const { addItem, getItemById, openCart } = useCartStore()
  const { has, toggle } = useWishlistStore()
  const [qty, setQty] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] ?? '')
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] ?? '')
  const [activeImg, setActiveImg] = useState(0)

  if (!product) return (
    <>
      <Topbar />
      <main className="p-7 flex flex-col items-center justify-center min-h-[60vh] text-text-3">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="font-syne font-bold text-xl text-text-2 mb-2">Product not found</h2>
        <button onClick={() => router.back()} className="mt-4 px-5 py-2.5 rounded-xl bg-bg-3 text-text text-sm border border-white/10 hover:bg-bg-4 transition-all">Go Back</button>
      </main>
    </>
  )

  const color = getServiceColor(product.service)
  const inCart = getItemById(product.id)
  const inWishlist = has(product.id)
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null
  const related = PRODUCTS[product.service].filter(p => p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ productId: product.id, name: product.name, price: product.price, emoji: product.emoji, service: product.service, vendorId: product.vendorId, vendorName: product.vendor },
        (selectedColor || selectedSize) ? { color: selectedColor, size: selectedSize } : undefined)
    }
    toast.success(`${qty}× ${product.name} added!`, {
      style: { background: '#1e1e2e', color: '#f0f0f8', border: '1px solid rgba(255,255,255,0.07)', borderLeft: `3px solid ${color}` },
      icon: product.emoji,
    })
    openCart()
  }

  return (
    <>
      <Topbar title={product.name} />
      <main className="p-7">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-text-2 hover:text-text mb-6 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Images */}
          <div>
            <div className="relative rounded-2xl flex items-center justify-center h-72 text-8xl mb-3 border border-white/[0.07]"
              style={{ background: `linear-gradient(135deg, ${color}18, ${color}06)` }}>
              <span className="select-none">{product.emoji}</span>
              {discount && (
                <span className="absolute top-4 left-4 text-xs font-bold px-2.5 py-1 rounded-full bg-clothing/20 text-clothing border border-clothing/30">-{discount}%</span>
              )}
            </div>
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl border transition-all ${activeImg === i ? 'border-white/30 bg-bg-4' : 'border-white/[0.07] bg-bg-3 hover:border-white/20'}`}>
                  {product.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color }}>{product.category}</p>
            <h1 className="font-syne font-black text-3xl text-text mb-2">{product.name}</h1>
            <p className="text-text-2 text-sm mb-4">by {product.vendor}</p>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= Math.round(product.rating) ? '#f5c842' : 'none'} stroke={s <= Math.round(product.rating) ? 'none' : '#6060a0'} />)}</div>
              <span className="text-sm font-bold text-gold">{product.rating}</span>
              <span className="text-xs text-text-3">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-syne font-black text-4xl" style={{ color }}>{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="text-lg text-text-3 line-through">{formatPrice(product.originalPrice)}</span>}
              {discount && <span className="text-sm font-bold px-2.5 py-1 rounded-full bg-clothing/20 text-clothing">Save {discount}%</span>}
            </div>

            {product.description && (
              <p className="text-text-2 text-sm leading-relaxed mb-5 border-l-2 pl-3" style={{ borderColor: color }}>{product.description}</p>
            )}

            {product.unit && (
              <div className="mb-4 text-sm text-text-2">Unit: <span className="text-text font-medium">{product.unit}</span></div>
            )}

            {product.isVeg !== undefined && (
              <div className="mb-4">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${product.isVeg ? 'bg-grocery/15 text-grocery border border-grocery/30' : 'bg-food/15 text-food border border-food/30'}`}>
                  {product.isVeg ? '🥬 Vegetarian' : '🍗 Non-Vegetarian'}
                </span>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-text-2 mb-2 uppercase tracking-wide">Color</p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${selectedColor === c ? 'text-text border-white/30 bg-bg-4' : 'text-text-2 border-white/[0.07] bg-bg-3 hover:border-white/20'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-text-2 mb-2 uppercase tracking-wide">Size</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all ${selectedSize === s ? 'text-text border-white/30 bg-bg-4' : 'text-text-2 border-white/[0.07] bg-bg-3 hover:border-white/20'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty & Add */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 bg-bg-3 rounded-xl border border-white/[0.07] p-1">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-lg bg-bg-4 flex items-center justify-center text-text-2 hover:text-text hover:bg-bg-3 transition-all"><Minus size={14} /></button>
                <span className="w-8 text-center font-syne font-bold text-text">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 rounded-lg bg-bg-4 flex items-center justify-center text-text-2 hover:text-text hover:bg-bg-3 transition-all"><Plus size={14} /></button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all" style={{ background: color }}>
                <ShoppingCart size={17} /> Add {qty} to Cart — {formatPrice(product.price * qty)}
              </button>
              <button onClick={() => toggle(product.id)}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${inWishlist ? 'bg-clothing/15 border-clothing/30 text-clothing' : 'bg-bg-3 border-white/[0.07] text-text-2 hover:border-clothing/30 hover:text-clothing'}`}>
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Info box */}
            <div className="bg-bg-3 rounded-xl border border-white/[0.07] p-4 text-sm text-text-2 space-y-2">
              <div className="flex justify-between"><span>Vendor</span><span className="text-text font-medium">{product.vendor}</span></div>
              <div className="flex justify-between"><span>Category</span><span className="text-text font-medium">{product.category}</span></div>
              <div className="flex justify-between"><span>Rating</span><span className="text-gold font-medium">⭐ {product.rating} / 5</span></div>
              {product.unit && <div className="flex justify-between"><span>Unit</span><span className="text-text font-medium">{product.unit}</span></div>}
              <div className="flex justify-between"><span>Availability</span><span className="text-grocery font-medium">✓ In Stock</span></div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mb-10">
          <h2 className="font-syne font-bold text-xl text-text mb-4">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[{ u: 'Priya S.', r: 5, t: 'Excellent quality!', b: 'Really loved it. Quick delivery and exactly as described. Will order again!', d: '2 days ago' },
              { u: 'Rajan M.', r: 4, t: 'Good value for money', b: 'Pretty good for the price. Packaging was secure and product looks exactly like the photos.', d: '1 week ago' }].map((review, i) => (
              <div key={i} className="bg-card border border-white/[0.07] rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-bg-4 flex items-center justify-center font-syne font-bold text-sm text-text">{review.u[0]}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text">{review.u}</p>
                    <p className="text-xs text-text-3">{review.d}</p>
                  </div>
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= review.r ? '#f5c842' : 'none'} stroke={s <= review.r ? 'none' : '#6060a0'} />)}</div>
                </div>
                <p className="text-sm font-semibold text-text mb-1">{review.t}</p>
                <p className="text-xs text-text-2 leading-relaxed">{review.b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="font-syne font-bold text-xl text-text mb-4">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </main>
    </>
  )
}
