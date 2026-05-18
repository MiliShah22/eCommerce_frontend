'use client'
import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react'

function PaymentContent() {
  const params = useSearchParams()
  const router = useRouter()
  const status = params.get('status') || 'success'
  const orderId = params.get('order') || 'ORD-2024-001'
  const amount = params.get('amount') || '697'
  const method = params.get('method') || 'Razorpay UPI'

  const configs = {
    success: {
      icon: CheckCircle, color: '#00c896', bg: 'rgba(0,200,150,0.15)', border: 'rgba(0,200,150,0.3)',
      title: 'Payment Successful! 🎉', msg: `₹${amount} has been paid via ${method}. Your order is confirmed.`,
      action: 'Track Your Order', href: `/orders/${orderId}`,
    },
    failed: {
      icon: XCircle, color: '#ff5252', bg: 'rgba(255,82,82,0.15)', border: 'rgba(255,82,82,0.3)',
      title: 'Payment Failed', msg: 'Your payment could not be processed. No charges were made.',
      action: 'Try Again', href: '/checkout',
    },
    pending: {
      icon: Clock, color: '#f5c842', bg: 'rgba(245,200,66,0.15)', border: 'rgba(245,200,66,0.3)',
      title: 'Payment Pending', msg: 'Your payment is being processed. We\'ll notify you once confirmed.',
      action: 'View Order', href: `/orders/${orderId}`,
    },
  }
  const cfg = configs[status as keyof typeof configs] || configs.success
  const Icon = cfg.icon

  return (
    <>
      <Topbar title="Payment" />
      <main className="p-7 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: cfg.bg, border: `2px solid ${cfg.border}` }}>
            <Icon size={48} style={{ color: cfg.color }} />
          </div>
          <h1 className="font-syne font-black text-3xl text-text mb-3">{cfg.title}</h1>
          <p className="text-text-2 text-sm leading-relaxed mb-6">{cfg.msg}</p>
          {status === 'success' && (
            <div className="bg-card border border-white/[0.07] rounded-2xl p-5 mb-6 text-left space-y-3 text-sm">
              <div className="flex justify-between text-text-2"><span>Order ID</span><span className="font-mono text-food text-xs">#{orderId}</span></div>
              <div className="flex justify-between text-text-2"><span>Amount Paid</span><span className="font-syne font-bold text-text">₹{amount}</span></div>
              <div className="flex justify-between text-text-2"><span>Payment Method</span><span className="text-text">{method}</span></div>
              <div className="flex justify-between text-text-2"><span>Status</span><span className="text-grocery font-semibold">✓ Confirmed</span></div>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => router.push(cfg.href)}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:brightness-110 transition-all"
              style={{ background: cfg.color }}>
              {cfg.action} <ArrowRight size={16} />
            </button>
            <button onClick={() => router.push('/')}
              className="px-5 py-3.5 rounded-xl bg-bg-3 border border-white/[0.07] text-text text-sm font-medium hover:bg-bg-4 transition-all">
              Home
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

export default function PaymentPage() {
  return <Suspense fallback={<div className="p-7 text-text-3">Loading…</div>}><PaymentContent /></Suspense>
}
