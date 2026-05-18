export type ServiceType = 'food' | 'grocery' | 'laundry' | 'clothing'

export interface Product {
  id: string
  name: string
  vendor: string
  vendorId: string
  price: number
  originalPrice?: number
  emoji: string
  badge?: string
  rating: number
  reviews: number
  category: string
  service: ServiceType
  isVeg?: boolean
  unit?: string
  colors?: string[]
  sizes?: string[]
  description?: string
  images?: string[]
  inStock: boolean
}

export interface Vendor {
  id: string
  name: string
  emoji: string
  tags: string[]
  rating: number
  deliveryTime: string
  isOpen: boolean
  minOrder: number
  color: string
  service: ServiceType
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  emoji: string
  quantity: number
  service: ServiceType
  vendorId: string
  vendorName: string
  variant?: { color?: string; size?: string }
}

export interface Order {
  id: string
  service: ServiceType
  vendor: string
  emoji: string
  items: string[]
  total: number
  status: OrderStatus
  date: string
  trackingCode: string
  address?: string
  paymentMethod?: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'

export interface Address {
  id: string
  label: string
  street: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export interface User {
  name: string
  email: string
  phone: string
  avatar?: string
  role: 'USER' | 'VENDOR' | 'ADMIN'
  joined: string
}
