'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'
import { ArrowLeft, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'

const CATS: Record<string, string[]> = {
  food: ['Biryani','Curries','Starters','South Indian','Burgers','Pizza','Pasta','Beverages','Desserts'],
  grocery: ['Vegetables','Fruits','Dairy','Grains','Snacks','Beverages'],
  laundry: ['Basic','Ironing','Dry Clean','Combo','Specialty','Home'],
  clothing: ['Ethnic','Western','Tops','Bottoms','Dresses','Outerwear','Accessories'],
}

const card: React.CSSProperties = { background:'#16161f', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:24 }
const inp: React.CSSProperties = { background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 14px', color:'#f0f0f8', fontSize:13, outline:'none', width:'100%', fontFamily:'DM Sans,sans-serif', boxSizing:'border-box' }
const lbl: React.CSSProperties = { fontSize:11, fontWeight:600, color:'#a0a0c0', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:8 }

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name:'', description:'', category:'', price:'', originalPrice:'', service:'food', unit:'', isVeg:true, stock:'' })
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const addTag = () => { if (tagInput.trim() && !tags.includes(tagInput.trim())) { setTags(t => [...t, tagInput.trim()]); setTagInput('') } }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) { toast.error('Fill required fields'); return }
    setSaving(true); await new Promise(r => setTimeout(r, 800))
    toast.success(`✅ "${form.name}" added successfully!`)
    setSaving(false); router.push('/vendor')
  }

  return (
    <>
      <Topbar title="Add Product" />
      <main style={{ padding:28, maxWidth:740 }}>
        <button onClick={() => router.push('/vendor')} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#a0a0c0', background:'none', border:'none', cursor:'pointer', marginBottom:24, padding:0 }}>
          <ArrowLeft size={15}/> Back to Vendor Panel
        </button>
        <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:24, color:'#f0f0f8', marginBottom:24 }}>Add New Product</h1>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Basic Info */}
          <div style={card}>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:'#f0f0f8', marginBottom:18 }}>Basic Information</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={lbl}>Product Name *</label>
                <input value={form.name} onChange={e => set('name',e.target.value)} placeholder="e.g. Chicken Biryani" style={inp}/>
              </div>
              <div>
                <label style={lbl}>Service *</label>
                <select value={form.service} onChange={e => set('service',e.target.value)} style={{ ...inp, cursor:'pointer' }}>
                  <option value="food">🍛 Food</option>
                  <option value="grocery">🛒 Grocery</option>
                  <option value="laundry">🧺 Laundry</option>
                  <option value="clothing">👗 Clothing</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Category *</label>
                <select value={form.category} onChange={e => set('category',e.target.value)} style={{ ...inp, cursor:'pointer' }}>
                  <option value="">Select…</option>
                  {(CATS[form.service]||[]).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={lbl}>Description</label>
                <textarea value={form.description} onChange={e => set('description',e.target.value)} rows={3} placeholder="Describe your product…" style={{ ...inp, resize:'none' }}/>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div style={card}>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:'#f0f0f8', marginBottom:18 }}>Pricing & Stock</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
              <div>
                <label style={lbl}>Selling Price (₹) *</label>
                <input type="number" value={form.price} onChange={e => set('price',e.target.value)} placeholder="249" style={inp}/>
              </div>
              <div>
                <label style={lbl}>Original Price (₹)</label>
                <input type="number" value={form.originalPrice} onChange={e => set('originalPrice',e.target.value)} placeholder="299" style={inp}/>
              </div>
              <div>
                <label style={lbl}>Stock Quantity</label>
                <input type="number" value={form.stock} onChange={e => set('stock',e.target.value)} placeholder="100" style={inp}/>
              </div>
              {(form.service==='grocery'||form.service==='laundry') && (
                <div>
                  <label style={lbl}>Unit</label>
                  <input value={form.unit} onChange={e => set('unit',e.target.value)} placeholder="kg, piece, pair…" style={inp}/>
                </div>
              )}
              {form.service==='food' && (
                <div>
                  <label style={lbl}>Dietary</label>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => set('isVeg',true)} style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid', cursor:'pointer', transition:'all 0.15s', borderColor:form.isVeg?'rgba(0,200,150,0.4)':'rgba(255,255,255,0.08)', background:form.isVeg?'rgba(0,200,150,.08)':'transparent', color:form.isVeg?'#00c896':'#6060a0', fontSize:12, fontWeight:600 }}>🥬 Veg</button>
                    <button onClick={() => set('isVeg',false)} style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid', cursor:'pointer', transition:'all 0.15s', borderColor:!form.isVeg?'rgba(255,107,53,0.4)':'rgba(255,255,255,0.08)', background:!form.isVeg?'rgba(255,107,53,.08)':'transparent', color:!form.isVeg?'#ff6b35':'#6060a0', fontSize:12, fontWeight:600 }}>🍗 Non-Veg</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div style={card}>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:'#f0f0f8', marginBottom:14 }}>Tags</h2>
            <div style={{ display:'flex', gap:8, marginBottom:12 }}>
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key==='Enter'&&addTag()} placeholder="Type a tag and press Enter…" style={{ ...inp, flex:1 }}/>
              <button onClick={addTag} style={{ width:38, height:38, borderRadius:10, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', color:'#a0a0c0', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Plus size={16}/></button>
            </div>
            {tags.length > 0 && (
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {tags.map(tag => (
                  <span key={tag} style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:20, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', fontSize:12, color:'#a0a0c0' }}>
                    {tag}
                    <button onClick={() => setTags(t => t.filter(x=>x!==tag))} style={{ background:'none', border:'none', cursor:'pointer', color:'#6060a0', display:'flex', alignItems:'center' }}><X size={11}/></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => router.push('/vendor')} style={{ padding:'12px 24px', borderRadius:12, background:'#1a1a26', border:'1px solid rgba(255,255,255,0.08)', color:'#a0a0c0', fontSize:13, fontWeight:600, cursor:'pointer' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving}
              style={{ flex:1, padding:'12px', borderRadius:12, background:'#ff6b35', border:'none', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:saving?0.6:1 }}>
              {saving ? <span style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/> : <Plus size={16}/>}
              {saving ? 'Saving…' : 'Add Product'}
            </button>
          </div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </main>
    </>
  )
}
