'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

const inp: React.CSSProperties = {
  background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)',
  borderRadius:12, padding:'11px 14px 11px 40px', color:'#f0f0f8',
  fontSize:13, outline:'none', width:'100%', fontFamily:'DM Sans,sans-serif', boxSizing:'border-box'
}

function FieldIcon({ icon }: { icon: string }) {
  const icons: Record<string, string> = { mail:'✉️', lock:'🔒', user:'👤', phone:'📱' }
  return <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', fontSize:14, pointerEvents:'none' }}>{icons[icon]}</span>
}

export default function AuthPage() {
  const [tab, setTab] = useState<'login'|'register'>('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name:'', email:'john@example.com', phone:'', password:'password', confirm:'' })
  const { login } = useAuth()
  const router = useRouter()
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Fill all fields'); return }
    setLoading(true); await new Promise(r => setTimeout(r, 800))
    login({ name:'John Doe', email:form.email, phone:'+91 98765 43210', role:'USER', joined:'Jan 2024' }, 'demo-token')
    toast.success('Welcome back! 👋'); setLoading(false); router.push('/')
  }

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error('Fill all fields'); return }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    setLoading(true); await new Promise(r => setTimeout(r, 800))
    login({ name:form.name, email:form.email, phone:form.phone, role:'USER', joined:new Date().toLocaleDateString('en-IN',{month:'short',year:'numeric'}) }, 'demo-token')
    toast.success('Account created! 🎉'); setLoading(false); router.push('/')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:'DM Sans,sans-serif' }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#ff6b35,#ff4d9e)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, color:'#fff', margin:'0 auto 14px' }}>S</div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:28, color:'#f0f0f8' }}>SwiftServe</h1>
          <p style={{ fontSize:13, color:'#6060a0', marginTop:4 }}>Food · Grocery · Laundry · Fashion</p>
        </div>
        <div style={{ background:'#16161f', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, padding:32 }}>
          <div style={{ display:'flex', background:'#1a1a26', borderRadius:14, padding:4, marginBottom:24 }}>
            {(['login','register'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:'10px', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', border:'none', background:tab===t?'#22223a':'transparent', color:tab===t?'#f0f0f8':'#6060a0', transition:'all 0.2s' }}>
                {t==='login'?'Sign In':'Create Account'}
              </button>
            ))}
          </div>
          {tab === 'login' ? (
            <form onSubmit={signIn} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:'#a0a0c0', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>Email Address</label>
                <div style={{ position:'relative' }}>
                  <FieldIcon icon="mail" />
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" style={inp} />
                </div>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:'#a0a0c0', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>Password</label>
                <div style={{ position:'relative' }}>
                  <FieldIcon icon="lock" />
                  <input type={showPass?'text':'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" style={inp} />
                  <button type="button" onClick={() => setShowPass(v=>!v)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#6060a0', display:'flex' }}>
                    {showPass ? <EyeOff size={14}/> : <Eye size={14}/>}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} style={{ padding:'13px', borderRadius:12, background:'#ff6b35', border:'none', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:loading?0.6:1, marginTop:4 }}>
                {loading ? <span style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} /> : <><ArrowRight size={16}/> Sign In</>}
              </button>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ flex:1,height:1,background:'rgba(255,255,255,0.07)' }}/>
                <span style={{ fontSize:12,color:'#6060a0' }}>or</span>
                <div style={{ flex:1,height:1,background:'rgba(255,255,255,0.07)' }}/>
              </div>
              <button type="button" onClick={() => { login({name:'John Doe',email:'john@gmail.com',phone:'+91 98765 43210',role:'USER',joined:'Jan 2024'}, 'demo-token'); router.push('/') }}
                style={{ padding:'12px', borderRadius:12, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', color:'#f0f0f8', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                🔵 Continue with Google
              </button>
            </form>
          ) : (
            <form onSubmit={signUp} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {([['name','Full Name','John Doe','user'],['email','Email','john@example.com','mail'],['phone','Phone','+91 98765 43210','phone']] as [string,string,string,string][]).map(([field,label,ph,icon]) => (
                <div key={field}>
                  <label style={{ fontSize:11, fontWeight:600, color:'#a0a0c0', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>{label}</label>
                  <div style={{ position:'relative' }}>
                    <FieldIcon icon={icon} />
                    <input type={field==='email'?'email':field==='phone'?'tel':'text'} value={(form as Record<string,string>)[field]} onChange={e => set(field, e.target.value)} placeholder={ph} style={inp} />
                  </div>
                </div>
              ))}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {([['password','Password'],['confirm','Confirm']] as [string,string][]).map(([field,label]) => (
                  <div key={field}>
                    <label style={{ fontSize:11, fontWeight:600, color:'#a0a0c0', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }}>{label}</label>
                    <div style={{ position:'relative' }}>
                      <FieldIcon icon="lock" />
                      <input type={showPass?'text':'password'} value={(form as Record<string,string>)[field]} onChange={e => set(field, e.target.value)} placeholder="••••••••" style={inp} />
                    </div>
                  </div>
                ))}
              </div>
              <button type="submit" disabled={loading} style={{ padding:'13px', borderRadius:12, background:'#ff6b35', border:'none', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:loading?0.6:1, marginTop:4 }}>
                {loading ? <span style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} /> : <><ArrowRight size={16}/> Create Account</>}
              </button>
            </form>
          )}
        </div>
        <div style={{ background:'#16161f', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:16, marginTop:16 }}>
          <p style={{ fontSize:11, fontWeight:600, color:'#6060a0', textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>Quick Demo Access</p>
          <div style={{ display:'flex', gap:8 }}>
            {([{role:'USER',label:'Customer',color:'#7c6fff'},{role:'VENDOR',label:'Vendor',color:'#00c896'},{role:'ADMIN',label:'Admin',color:'#ff4d9e'}] as const).map(r => (
              <button key={r.role} onClick={() => { login({name:`Demo ${r.label}`,email:`demo@${r.role.toLowerCase()}.com`,phone:'+91 00000 00000',role:r.role,joined:'Jan 2024'}, 'demo-token'); toast.success(`Logged in as ${r.label}`); router.push('/') }}
                style={{ flex:1, padding:'10px', borderRadius:12, fontSize:12, fontWeight:700, cursor:'pointer', border:`1px solid ${r.color}35`, background:`${r.color}18`, color:r.color }}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
