import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import CartPanel from '@/components/cart/CartPanel'
import { Toaster } from 'react-hot-toast'
import StoreProvider from './StoreProvider'

export const metadata: Metadata = {
  title: 'SwiftServe – Super App',
  description: 'Food, Grocery, Laundry & Fashion – one app, one checkout',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg min-h-screen">
        <StoreProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              {children}
            </div>
          </div>
          <CartPanel />
          <Toaster position="bottom-center" toastOptions={{ duration: 2500 }} />
        </StoreProvider>
      </body>
    </html>
  )
}
