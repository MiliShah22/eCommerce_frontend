import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ServiceType } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`
}

export function getServiceColor(service: ServiceType): string {
  const map: Record<ServiceType, string> = {
    food: '#ff6b35',
    grocery: '#00c896',
    laundry: '#7c6fff',
    clothing: '#ff4d9e',
  }
  return map[service]
}

export function getServiceBgClass(service: ServiceType): string {
  const map: Record<ServiceType, string> = {
    food: 'bg-food/10',
    grocery: 'bg-grocery/10',
    laundry: 'bg-laundry/10',
    clothing: 'bg-clothing/10',
  }
  return map[service]
}

export function getServiceTextClass(service: ServiceType): string {
  const map: Record<ServiceType, string> = {
    food: 'text-food',
    grocery: 'text-grocery',
    laundry: 'text-laundry',
    clothing: 'text-clothing',
  }
  return map[service]
}

export function getStatusStyle(status: string): { bg: string; text: string; border: string } {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    pending: { bg: 'bg-gold/15', text: 'text-gold', border: 'border-gold/25' },
    confirmed: { bg: 'bg-grocery/15', text: 'text-grocery', border: 'border-grocery/25' },
    preparing: { bg: 'bg-food/15', text: 'text-food', border: 'border-food/25' },
    out_for_delivery: { bg: 'bg-laundry/15', text: 'text-laundry', border: 'border-laundry/25' },
    delivered: { bg: 'bg-grocery/15', text: 'text-grocery', border: 'border-grocery/25' },
    cancelled: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/25' },
  }
  return map[status] ?? map.pending
}
