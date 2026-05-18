'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, getServiceColor } from '@/lib/utils'
import { ShieldCheck, MapPin, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const STEPS = ['Review Cart', 'Delivery', 'Payment', 'Confirm']

const ADDRESSES = [
  { id: 'a1', label: 'Home', address: '42, Alkapuri Society, Race Course Circle, Vadodara – 390007', icon: '🏠', default: true },
  { id: 'a2', label: 'Work', address: 'Landmark Business Hub, Productivity Rd, Vadodara – 390020', icon: '🏢', default: false },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getDeliveryFee, getTax, getTotal, clearCart, updateQuantity, removeItem } = useCartStore()
  const [step, setStep] = useState(0)
  const [selectedAddress, setSelectedAddress] = useState('a1')
  const [selectedPayment, setSelectedPayment] = useState('razorpay')
  const [instructions, setInstructions] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [trackingCode] = useState(`SW-${Math.random().toString(36).substr(2, 8).toUpperCase()}`)

  const subtotal = getSubtotal()
  const deliveryFee = getDeliveryFee()
  const tax = getTax()
  const total = getTotal()

  if (!items.length && !orderPlaced) {
    return (
      <>
        <Topbar title="Checkout" />
        <main className="p-7 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="font-syne font-bold text-2xl text-text mb-2">Your cart is empty</h2>
          <p className="text-text-2 text-sm mb-6">Add items from our services to get started</p>
          <button onClick={() => router.push('/')} className="px-6 py-3 rounded-xl bg-food text-white font-semibold hover:brightness-110 transition-all">Browse Services</button>
        </main>
      </>
    )
  }

  const handlePlaceOrder = () => {
    setStep(3)
    setOrderPlaced(true)
    clearCart()
    toast.success('🎉 Order placed successfully!', {
      style: { background: '#1e1e2e', color: '#f0f0f8', border: '1px solid rgba(0,200,150,0.3)' },
    })
  }

  const stepContent = [
    // Step 0: Cart Review
    <div key="cart" className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-4 p-4 bg-bg-3 rounded-xl border border-white/[0.07]">
          <span className="text-2xl w-10 text-center">{item.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text line-clamp-1">{item.name}</p>
            <p className="text-xs text-text-3">{item.vendorName}</p>
            {item.variant && <p className="text-xs text-text-3 mt-0.5">{item.variant.color}{item.variant.size ? ` · ${item.variant.size}` : ''}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-bg-4 border border-white/[0.07] flex items-center justify-center text-text-2 hover:text-text text-sm">−</button>
            <span className="w-5 text-center font-bold text-text text-sm">{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-bg-4 border border-white/[0.07] flex items-center justify-center text-text-2 hover:text-text text-sm">+</button>
          </div>
          <span className="font-syne font-bold text-sm min-w-[60px] text-right" style={{ color: getServiceColor(item.service) }}>{formatPrice(item.price * item.quantity)}</span>
          <button onClick={() => removeItem(item.id)} className="text-red-400/60 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={() => setStep(1)} className="w-full py-3.5 mt-2 rounded-xl bg-food text-white font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all">
        Continue to Delivery <ArrowRight size={16} />
      </button>
    </div>,

    // Step 1: Delivery
    <div key="delivery" className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-text-2 mb-3 uppercase tracking-wide">Select Address</h3>
        {ADDRESSES.map(addr => (
          <div key={addr.id} onClick={() => setSelectedAddress(addr.id)}
            className={`flex items-start gap-3 p-4 rounded-xl border mb-2 cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-grocery/40 bg-grocery/[0.06]' : 'border-white/[0.07] bg-bg-3 hover:border-white/20'}`}>
            <span className="text-xl">{addr.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-text">{addr.label}</p>
                {addr.default && <span className="text-[10px] px-2 py-0.5 rounded-full bg-grocery/15 text-grocery font-semibold">Default</span>}
              </div>
              <p className="text-xs text-text-2 mt-1">{addr.address}</p>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedAddress === addr.id ? 'border-grocery bg-grocery' : 'border-white/30'}`}>
              {selectedAddress === addr.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>
        ))}
        <button className="flex items-center gap-2 text-xs text-text-3 hover:text-text-2 transition-colors mt-2">
          <MapPin size={13} /> + Add new address
        </button>
      </div>
      <div>
        <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Delivery Instructions (optional)</label>
        <textarea value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Ring doorbell, leave at door, call on arrival…"
          className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text placeholder-text-3 outline-none focus:border-white/20 resize-none transition-colors" rows={3} />
      </div>
      <div className="flex gap-3">
        <button onClick={() => setStep(0)} className="px-5 py-3 rounded-xl bg-bg-3 border border-white/[0.07] text-text text-sm hover:bg-bg-4 transition-all flex items-center gap-2"><ArrowLeft size={14} /> Back</button>
        <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl bg-food text-white font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all">Continue to Payment <ArrowRight size={16} /></button>
      </div>
    </div>,

    // Step 2: Payment
    <div key="payment" className="space-y-3">
      {[
        { id: 'razorpay', icon: '📱', label: 'Razorpay UPI', desc: 'Pay via any UPI app — GPay, PhonePe, Paytm', tag: 'Recommended' },
        { id: 'stripe', icon: '💳', label: 'Stripe Card', desc: 'Credit card, Debit card, Net banking' },
        { id: 'cod', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when your order arrives at the door' },
      ].map(method => (
        <div key={method.id} onClick={() => setSelectedPayment(method.id)}
          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedPayment === method.id ? 'border-grocery/40 bg-grocery/[0.06]' : 'border-white/[0.07] bg-bg-3 hover:border-white/20'}`}>
          <span className="text-2xl">{method.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-text">{method.label}</p>
              {method.tag && <span className="text-[10px] px-2 py-0.5 rounded-full bg-grocery/15 text-grocery font-semibold">{method.tag}</span>}
            </div>
            <p className="text-xs text-text-3 mt-0.5">{method.desc}</p>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id ? 'border-grocery bg-grocery' : 'border-white/30'}`}>
            {selectedPayment === method.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 bg-bg-3 rounded-xl p-3 border border-white/[0.07] mt-2">
        <ShieldCheck size={16} className="text-grocery flex-shrink-0" />
        <p className="text-xs text-text-2">256-bit SSL encryption. Your payment information is fully secure.</p>
      </div>
      <div className="flex gap-3 pt-1">
        <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl bg-bg-3 border border-white/[0.07] text-text text-sm hover:bg-bg-4 transition-all flex items-center gap-2"><ArrowLeft size={14} /> Back</button>
        <button onClick={handlePlaceOrder} className="flex-1 py-3 rounded-xl bg-grocery text-white font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all">
          <CheckCircle size={16} /> Place Order — {formatPrice(total)}
        </button>
      </div>
    </div>,

    // Step 3: Confirmation
    <div key="confirm" className="text-center space-y-6">
      <div className="py-6">
        <div className="w-20 h-20 rounded-full bg-grocery/20 border border-grocery/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-grocery" />
        </div>
        <h2 className="font-syne font-black text-3xl text-text mb-2">Order Placed! 🎉</h2>
        <p className="text-text-2 text-sm">Your order is confirmed and being prepared.</p>
        <div className="mt-4 inline-block px-5 py-2 rounded-xl bg-grocery/10 border border-grocery/25 font-mono text-sm text-grocery font-semibold">{trackingCode}</div>
      </div>
      <div className="bg-bg-3 rounded-xl border border-white/[0.07] p-5 text-left space-y-2 text-sm">
        <div className="flex justify-between text-text-2"><span>Delivery to</span><span className="text-text text-right text-xs">{ADDRESSES.find(a => a.id === selectedAddress)?.address}</span></div>
        <div className="flex justify-between text-text-2"><span>Payment via</span><span className="text-text font-medium">{{ razorpay: 'Razorpay UPI', stripe: 'Stripe Card', cod: 'Cash on Delivery' }[selectedPayment]}</span></div>
        <div className="flex justify-between font-syne font-bold text-base pt-2 border-t border-white/[0.07]"><span>Total Paid</span><span className="text-grocery">{formatPrice(total)}</span></div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => router.push('/orders')} className="flex-1 py-3 rounded-xl bg-food text-white font-semibold text-sm hover:brightness-110 transition-all">Track My Order</button>
        <button onClick={() => router.push('/')} className="flex-1 py-3 rounded-xl bg-bg-3 border border-white/[0.07] text-text text-sm hover:bg-bg-4 transition-all">Continue Shopping</button>
      </div>
    </div>,
  ]

  return (
    <>
      <Topbar title="Checkout" />
      <main className="p-7">
        {/* Step indicators */}
        {step < 3 && (
          <div className="flex mb-8">
            {STEPS.slice(0, 3).map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${i < step ? 'bg-grocery border-grocery text-white' : i === step ? 'border-grocery/60 bg-grocery/10 text-grocery' : 'border-white/20 text-text-3'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-[11px] mt-1 ${i === step ? 'text-grocery' : 'text-text-3'}`}>{s}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-px mx-2 mb-5 transition-all ${i < step ? 'bg-grocery' : 'bg-white/[0.07]'}`} />}
              </div>
            ))}
          </div>
        )}

        <div className={step === 3 ? 'max-w-lg mx-auto' : 'grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start'}>
          <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
            {stepContent[step]}
          </div>

          {/* Order Summary sidebar */}
          {step < 3 && (
            <div className="space-y-4">
              <div className="bg-card border border-white/[0.07] rounded-2xl p-5">
                <h3 className="font-syne font-bold text-text text-base mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm mb-4">
                  {items.map(i => (
                    <div key={i.id} className="flex justify-between text-text-2">
                      <span className="truncate mr-2">{i.name} ×{i.quantity}</span>
                      <span className="text-text font-medium flex-shrink-0">{formatPrice(i.price * i.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/[0.07] pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-text-2"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between text-text-2"><span>Delivery fee</span><span className="text-grocery">{formatPrice(deliveryFee)}</span></div>
                  <div className="flex justify-between text-text-2"><span>Tax (5%)</span><span>{formatPrice(tax)}</span></div>
                  <div className="flex justify-between font-syne font-bold text-lg pt-2 border-t border-white/[0.07]">
                    <span>Total</span><span className="text-food">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-bg-3 rounded-xl p-4 border border-white/[0.07]">
                <ShieldCheck size={18} className="text-grocery mt-0.5 flex-shrink-0" />
                <p className="text-xs text-text-2 leading-relaxed">Secured checkout. 100% safe & encrypted payments. Easy returns within 7 days.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
