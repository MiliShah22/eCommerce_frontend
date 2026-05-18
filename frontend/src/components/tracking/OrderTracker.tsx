'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, Store, ChefHat, Bike, Home, Clock } from 'lucide-react'
import type { OrderStatus } from '@/types'

const STEPS: { label: string; icon: React.ElementType; key: OrderStatus | 'placed'; eta: string }[] = [
  { label: 'Order Placed', icon: CheckCircle, key: 'placed', eta: '' },
  { label: 'Confirmed', icon: Store, key: 'confirmed', eta: '~2 min' },
  { label: 'Preparing', icon: ChefHat, key: 'preparing', eta: '~15 min' },
  { label: 'On the Way', icon: Bike, key: 'out_for_delivery', eta: '~10 min' },
  { label: 'Delivered', icon: Home, key: 'delivered', eta: '' },
]

const STATUS_ORDER = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']

interface OrderTrackerProps {
  status: OrderStatus
  orderId: string
  simulateLive?: boolean
}

export default function OrderTracker({ status, orderId, simulateLive = false }: OrderTrackerProps) {
  const [currentStatus, setCurrentStatus] = useState<string>(status === 'pending' ? 'placed' : status)
  const [isLive, setIsLive] = useState(simulateLive)

  // Simulate real-time progression for active orders
  useEffect(() => {
    if (!simulateLive) return
    if (['delivered', 'cancelled'].includes(currentStatus)) return
    const idx = STATUS_ORDER.indexOf(currentStatus)
    if (idx >= STATUS_ORDER.length - 1) return
    const timer = setTimeout(() => {
      setCurrentStatus(STATUS_ORDER[idx + 1])
    }, 5000)
    return () => clearTimeout(timer)
  }, [currentStatus, simulateLive])

  const currentIdx = STATUS_ORDER.indexOf(currentStatus)

  return (
    <div className="relative">
      {isLive && currentStatus !== 'delivered' && (
        <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl bg-grocery/10 border border-grocery/25 w-fit">
          <span className="w-2 h-2 rounded-full bg-grocery animate-pulse" />
          <span className="text-xs font-semibold text-grocery">Live tracking active</span>
        </div>
      )}

      <div className="space-y-0">
        {STEPS.map((step, i) => {
          const done = i <= currentIdx
          const active = i === currentIdx
          const Icon = step.icon
          return (
            <div key={step.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all duration-500 ${
                  done ? 'bg-grocery border-grocery text-white' : 'border-white/20 bg-bg-3 text-text-3'
                } ${active && currentStatus !== 'delivered' ? 'ring-4 ring-grocery/20' : ''}`}>
                  <Icon size={15} />
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-0.5 flex-1 my-1 min-h-[28px] transition-all duration-700 ${i < currentIdx ? 'bg-grocery' : 'bg-white/[0.07]'}`} />
                )}
              </div>
              <div className="pb-7 pt-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold transition-colors ${done ? 'text-text' : 'text-text-3'}`}>{step.label}</p>
                    {active && currentStatus !== 'delivered' && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock size={11} className="text-food" />
                        <p className="text-xs text-food font-medium">In progress {step.eta && `· ETA ${step.eta}`}</p>
                      </div>
                    )}
                    {done && !active && i === 0 && (
                      <p className="text-xs text-text-3 mt-0.5">Order confirmed & payment received</p>
                    )}
                    {i === currentIdx && currentStatus === 'delivered' && (
                      <p className="text-xs text-grocery mt-0.5">🎉 Enjoy your order!</p>
                    )}
                  </div>
                  {active && currentStatus !== 'delivered' && (
                    <div className="flex gap-1">
                      {[0,1,2].map(d => (
                        <div key={d} className="w-1.5 h-1.5 rounded-full bg-food animate-bounce"
                          style={{ animationDelay: `${d * 0.15}s` }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {simulateLive && currentStatus !== 'delivered' && (
        <button onClick={() => setCurrentStatus(STATUS_ORDER[Math.min(currentIdx + 1, STATUS_ORDER.length - 1)])}
          className="mt-2 text-xs text-text-3 hover:text-laundry transition-colors underline">
          Simulate next step →
        </button>
      )}
    </div>
  )
}
