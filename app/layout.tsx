import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import CartPanel from '@/components/cart/CartPanel'
import Providers from './providers'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'SwiftServe – Super App',
  description: 'Food · Grocery · Laundry · Fashion — one app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#0a0a0f', color: '#f0f0f8', margin: 0 }}>
        <Providers>
          <div style={{ display:'flex', minHeight:'100vh' }}>
            <Sidebar />
            <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
              {children}
            </div>
          </div>
          <CartPanel />
          <Toaster position="bottom-center" toastOptions={{ duration: 2500, style:{ background:'#1e1e2e', color:'#f0f0f8', border:'1px solid rgba(255,255,255,0.08)', fontFamily:'DM Sans,sans-serif', fontSize:'14px' } }} />
        </Providers>
      </body>
    </html>
  )
}
