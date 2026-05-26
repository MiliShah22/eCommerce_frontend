import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ServiceType, OrderStatus } from '@/types'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export const fmt = (n:number) => `₹${n.toLocaleString('en-IN')}`

export const SVC = {
  food:    { color:'#ff6b35', label:'Food Delivery',   emoji:'🍛', desc:'Hot meals in 30 mins', stat:'240+ restaurants' },
  grocery: { color:'#00c896', label:'Grocery',         emoji:'🛒', desc:'Fresh daily essentials', stat:'5,000+ products' },
  laundry: { color:'#7c6fff', label:'Laundry',         emoji:'🧺', desc:'Free pickup & delivery', stat:'From ₹25/piece' },
  clothing:{ color:'#ff4d9e', label:'Fashion',         emoji:'👗', desc:'Ethnic & western styles', stat:'10,000+ styles' },
} as const satisfies Record<ServiceType,{color:string;label:string;emoji:string;desc:string;stat:string}>

export function svcColor(s:ServiceType){ return SVC[s].color }

export function statusStyle(s:OrderStatus){
  const m:Record<OrderStatus,string>={
    pending:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-green-500/15 text-green-400 border-green-500/30',
    preparing: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    out_for_delivery:'bg-blue-500/15 text-blue-400 border-blue-500/30',
    delivered: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
  }
  return m[s]??m.pending
}

export function timeAgo(iso:string){
  const d=(Date.now()-new Date(iso).getTime())/1000
  if(d<60) return 'just now'
  if(d<3600) return `${Math.floor(d/60)}m ago`
  if(d<86400) return `${Math.floor(d/3600)}h ago`
  return `${Math.floor(d/86400)}d ago`
}

export type StatusStyleObj = { bg: string; color: string; border: string }
export const STATUS_OBJ: Record<OrderStatus, StatusStyleObj> = {
  pending:          { bg:'rgba(245,200,66,0.15)',  color:'#f5c842', border:'1px solid rgba(245,200,66,0.3)' },
  confirmed:        { bg:'rgba(0,200,150,0.15)',   color:'#00c896', border:'1px solid rgba(0,200,150,0.3)' },
  preparing:        { bg:'rgba(255,107,53,0.15)',  color:'#ff6b35', border:'1px solid rgba(255,107,53,0.3)' },
  out_for_delivery: { bg:'rgba(124,111,255,0.15)', color:'#7c6fff', border:'1px solid rgba(124,111,255,0.3)' },
  delivered:        { bg:'rgba(0,200,150,0.15)',   color:'#00c896', border:'1px solid rgba(0,200,150,0.3)' },
  cancelled:        { bg:'rgba(255,82,82,0.15)',   color:'#ff5252', border:'1px solid rgba(255,82,82,0.3)' },
}
export const statusObj = (s: OrderStatus): StatusStyleObj => STATUS_OBJ[s] ?? STATUS_OBJ.pending
