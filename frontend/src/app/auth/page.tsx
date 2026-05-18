'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ChevronRight } from 'lucide-react'

type Tab = 'login' | 'register'

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name:'', email:'john@example.com', phone:'', password:'password', confirmPassword:'' })
  const { login } = useAuthStore()
  const router = useRouter()

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    login({ name: 'John Doe', email: form.email, phone: '+91 98765 43210', role: 'USER', joined: 'Jan 2024' })
    toast.success('Welcome back, John! 👋', { style:{ background:'#1e1e2e', color:'#f0f0f8', border:'1px solid rgba(0,200,150,.3)' } })
    setLoading(false)
    router.push('/')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields'); return }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    login({ name: form.name, email: form.email, phone: form.phone, role: 'USER', joined: new Date().toLocaleDateString('en-IN',{ month:'short', year:'numeric' }) })
    toast.success('Account created! Welcome 🎉', { style:{ background:'#1e1e2e', color:'#f0f0f8', border:'1px solid rgba(0,200,150,.3)' } })
    setLoading(false)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-food to-clothing flex items-center justify-center font-syne font-black text-2xl text-white mx-auto mb-4">S</div>
          <h1 className="font-syne font-black text-3xl text-text">SwiftServe</h1>
          <p className="text-text-3 text-sm mt-1">Food · Grocery · Laundry · Fashion</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-white/[0.07] rounded-3xl p-8">
          {/* Tab Switch */}
          <div className="flex bg-bg-3 rounded-xl p-1 mb-7">
            {(['login','register'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${tab===t ? 'bg-card text-text border border-white/[0.07]' : 'text-text-3 hover:text-text-2'}`}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-bg-3 border border-white/[0.07] rounded-xl pl-10 pr-4 py-3 text-sm text-text placeholder-text-3 outline-none focus:border-white/20 transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-bg-3 border border-white/[0.07] rounded-xl pl-10 pr-10 py-3 text-sm text-text placeholder-text-3 outline-none focus:border-white/20 transition-colors" />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-3 hover:text-text-2">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div className="text-right mt-1">
                  <button type="button" className="text-xs text-text-3 hover:text-food transition-colors">Forgot password?</button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl bg-food text-white font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-2">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><ArrowRight size={16} /> Sign In</>}
              </button>
              {/* Social */}
              <div className="relative flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-white/[0.07]" />
                <span className="text-xs text-text-3">or continue with</span>
                <div className="flex-1 h-px bg-white/[0.07]" />
              </div>
              <button type="button" onClick={() => { login({ name:'John Doe', email:'john@gmail.com', phone:'+91 98765 43210', role:'USER', joined:'Jan 2024' }); toast.success('Google sign-in successful!'); router.push('/'); }}
                className="w-full py-3 rounded-xl bg-bg-3 border border-white/[0.07] text-text text-sm font-medium flex items-center justify-center gap-2 hover:bg-bg-4 hover:border-white/20 transition-all">
                <span className="text-base">🔵</span> Sign in with Google
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Doe"
                    className="w-full bg-bg-3 border border-white/[0.07] rounded-xl pl-10 pr-4 py-3 text-sm text-text placeholder-text-3 outline-none focus:border-white/20 transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com"
                    className="w-full bg-bg-3 border border-white/[0.07] rounded-xl pl-10 pr-4 py-3 text-sm text-text placeholder-text-3 outline-none focus:border-white/20 transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Phone Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210"
                    className="w-full bg-bg-3 border border-white/[0.07] rounded-xl pl-10 pr-4 py-3 text-sm text-text placeholder-text-3 outline-none focus:border-white/20 transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
                    <input type={showPass ? 'text':'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••"
                      className="w-full bg-bg-3 border border-white/[0.07] rounded-xl pl-10 pr-4 py-3 text-sm text-text placeholder-text-3 outline-none focus:border-white/20 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Confirm</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
                    <input type={showPass ? 'text':'password'} value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="••••••••"
                      className="w-full bg-bg-3 border border-white/[0.07] rounded-xl pl-10 pr-4 py-3 text-sm text-text placeholder-text-3 outline-none focus:border-white/20 transition-colors" />
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-text-3 mt-1">
                <input type="checkbox" className="mt-0.5 accent-food" required />
                <span>I agree to the <span className="text-food cursor-pointer hover:underline">Terms of Service</span> and <span className="text-food cursor-pointer hover:underline">Privacy Policy</span></span>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl bg-food text-white font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><ArrowRight size={16} /> Create Account</>}
              </button>
            </form>
          )}
        </div>

        {/* Role selector hint */}
        <div className="mt-4 bg-card border border-white/[0.05] rounded-2xl p-4">
          <p className="text-xs text-text-3 mb-3 font-semibold uppercase tracking-wide">Quick demo access</p>
          <div className="flex gap-2">
            {[{role:'USER',label:'Customer',color:'#7c6fff'},{role:'VENDOR',label:'Vendor',color:'#00c896'},{role:'ADMIN',label:'Admin',color:'#ff4d9e'}].map(r => (
              <button key={r.role} onClick={() => { login({ name:'Demo '+r.label, email:`demo-${r.role.toLowerCase()}@swiftserve.com`, phone:'+91 00000 00000', role: r.role as 'USER'|'VENDOR'|'ADMIN', joined:'Jan 2024' }); toast.success(`Logged in as ${r.label}`); router.push('/'); }}
                className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all hover:brightness-110"
                style={{ background:`${r.color}18`, color:r.color, borderColor:`${r.color}35` }}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
