'use client'
import { useEffect } from 'react'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, getServiceColor } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { ServiceType } from '@/types'

export default function CartPanel() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getDeliveryFee, getTax, getTotal, getCount } = useCartStore()
  const subtotal = getSubtotal()
  const deliveryFee = getDeliveryFee()
  const tax = getTax()
  const total = getTotal()
  const count = getCount()

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const serviceColors: Record<ServiceType, string> = {
    food: 'bg-food/15',
    grocery: 'bg-grocery/15',
    laundry: 'bg-laundry/15',
    clothing: 'bg-clothing/15',
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={cn('fixed inset-0 bg-black/60 z-40 transition-opacity duration-300', isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')}
        onClick={closeCart}
      />
      {/* Panel */}
      <div className={cn(
        'fixed top-0 right-0 h-full w-[380px] bg-bg-2 border-l border-white/[0.07] z-50 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
          <div>
            <h2 className="font-syne font-bold text-xl text-text flex items-center gap-2">
              <ShoppingCart size={20} className="text-food" />
              My Cart
            </h2>
            <p className="text-xs text-text-3 mt-0.5">{count} {count === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={closeCart} className="w-9 h-9 rounded-xl bg-bg-3 border border-white/[0.07] flex items-center justify-center text-text-2 hover:text-text hover:bg-bg-4 transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center pb-20">
              <div className="w-20 h-20 rounded-2xl bg-bg-3 flex items-center justify-center">
                <ShoppingBag size={32} className="text-text-3" />
              </div>
              <div>
                <p className="font-syne font-semibold text-text-2 text-lg">Your cart is empty</p>
                <p className="text-text-3 text-sm mt-1">Browse our services and add items</p>
              </div>
              <button onClick={closeCart} className="mt-2 px-6 py-2.5 rounded-xl bg-food text-white text-sm font-medium hover:brightness-110 transition-all">
                Start Shopping
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-bg-3 border border-white/[0.05] group">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0', serviceColors[item.service])}>
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text leading-tight line-clamp-1">{item.name}</p>
                  <p className="text-xs text-text-3 mt-0.5">{item.vendorName}</p>
                  {item.variant && (
                    <p className="text-xs text-text-3 mt-0.5">
                      {item.variant.color && `${item.variant.color}`}{item.variant.size && ` · ${item.variant.size}`}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold font-syne" style={{ color: getServiceColor(item.service) }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-bg-4 border border-white/[0.07] flex items-center justify-center text-text-2 hover:text-text hover:bg-bg-3 transition-all"
                      >
                        {item.quantity === 1 ? <Trash2 size={10} className="text-red-400" /> : <Minus size={10} />}
                      </button>
                      <span className="text-sm font-semibold text-text w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-bg-4 border border-white/[0.07] flex items-center justify-center text-text-2 hover:text-text hover:bg-bg-3 transition-all"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0 mt-0.5"
                >
                  <X size={12} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-white/[0.07] space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-text-2">
                <span>Subtotal</span>
                <span className="text-text font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-2">
                <span>Delivery fee</span>
                <span className="text-grocery font-medium">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-text-2">
                <span>Tax (5%)</span>
                <span className="text-text font-medium">{formatPrice(tax)}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-white/[0.07] flex justify-between items-baseline">
              <span className="font-syne font-bold text-text text-base">Total</span>
              <span className="font-syne font-bold text-xl text-food">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" onClick={closeCart}
              className="w-full py-3.5 rounded-xl bg-food text-white font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all mt-1">
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <button onClick={() => useCartStore.getState().clearCart()} className="w-full text-xs text-text-3 hover:text-red-400 transition-colors py-1">
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
