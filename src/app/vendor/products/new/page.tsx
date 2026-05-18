'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from '@/components/layout/Topbar'
import { ArrowLeft, Plus, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = { food: ['Biryani','Curries','Starters','South Indian','Burgers','Pizza','Pasta','Beverages','Desserts'], grocery: ['Vegetables','Fruits','Dairy','Grains','Snacks','Beverages'], laundry: ['Basic','Ironing','Dry Clean','Combo','Specialty','Home'], clothing: ['Ethnic','Western','Tops','Bottoms','Dresses','Outerwear','Accessories'] }

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', originalPrice: '', service: 'food', unit: '', isVeg: true, stock: '', prepTime: '' })
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [variants, setVariants] = useState<Array<{ color: string; size: string; price: string; stock: string }>>([])
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))
  const addTag = () => { if (tagInput.trim() && !tags.includes(tagInput.trim())) { setTags(t => [...t, tagInput.trim()]); setTagInput('') } }
  const removeTag = (tag: string) => setTags(t => t.filter(x => x !== tag))
  const addVariant = () => setVariants(v => [...v, { color: '', size: '', price: '', stock: '' }])

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) { toast.error('Please fill required fields'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success(`✅ "${form.name}" added to your product list!`, { style: { background: '#1e1e2e', color: '#f0f0f8', border: '1px solid rgba(0,200,150,.3)' } })
    setSaving(false)
    router.push('/vendor')
  }

  const cats = CATEGORIES[form.service as keyof typeof CATEGORIES] || []

  return (
    <>
      <Topbar title="Add New Product" />
      <main className="p-7 max-w-3xl">
        <button onClick={() => router.push('/vendor')} className="flex items-center gap-2 text-sm text-text-2 hover:text-text mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to Vendor Panel
        </button>
        <h1 className="font-syne font-black text-2xl text-text mb-6">Add New Product</h1>

        <div className="space-y-5">
          {/* Basic Info */}
          <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
            <h2 className="font-syne font-bold text-text text-base mb-5">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Product Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Chicken Biryani"
                  className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text placeholder-text-3 outline-none focus:border-white/20 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Service *</label>
                <select value={form.service} onChange={e => set('service', e.target.value)}
                  className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none">
                  <option value="food">🍛 Food Delivery</option>
                  <option value="grocery">🛒 Grocery</option>
                  <option value="laundry">🧺 Laundry</option>
                  <option value="clothing">👗 Clothing</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Category *</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none">
                  <option value="">Select category…</option>
                  {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
                  placeholder="Describe the product, ingredients, or service details…"
                  className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text placeholder-text-3 outline-none focus:border-white/20 resize-none transition-colors" />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
            <h2 className="font-syne font-bold text-text text-base mb-5">Pricing & Inventory</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Selling Price (₹) *</label>
                <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="249"
                  className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-white/20 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Original Price (₹)</label>
                <input type="number" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} placeholder="299"
                  className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-white/20 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Stock / Inventory</label>
                <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="100"
                  className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-white/20 transition-colors" />
              </div>
              {(form.service === 'grocery' || form.service === 'laundry') && (
                <div>
                  <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Unit</label>
                  <input value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="kg, piece, pair…"
                    className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-white/20 transition-colors" />
                </div>
              )}
              {form.service === 'food' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Prep Time (min)</label>
                    <input type="number" value={form.prepTime} onChange={e => set('prepTime', e.target.value)} placeholder="25"
                      className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-white/20 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-2 uppercase tracking-wide block mb-2">Dietary</label>
                    <div className="flex gap-2">
                      <button onClick={() => set('isVeg', true)} className={`flex-1 py-3 rounded-xl border text-xs font-semibold transition-all ${form.isVeg ? 'bg-grocery/10 border-grocery/30 text-grocery' : 'bg-bg-3 border-white/[0.07] text-text-2'}`}>🥬 Veg</button>
                      <button onClick={() => set('isVeg', false)} className={`flex-1 py-3 rounded-xl border text-xs font-semibold transition-all ${!form.isVeg ? 'bg-food/10 border-food/30 text-food' : 'bg-bg-3 border-white/[0.07] text-text-2'}`}>🍗 Non-Veg</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
            <h2 className="font-syne font-bold text-text text-base mb-4">Tags & Keywords</h2>
            <div className="flex gap-2 mb-3">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Add a tag…"
                className="flex-1 bg-bg-3 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 outline-none focus:border-white/20 transition-colors" />
              <button onClick={addTag} className="px-4 py-2.5 rounded-xl bg-bg-3 border border-white/[0.07] text-text-2 hover:text-text hover:bg-bg-4 transition-all"><Plus size={16} /></button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-3 border border-white/[0.07] text-text-2 text-xs">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="text-text-3 hover:text-red-400 transition-colors"><X size={11} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Clothing variants */}
          {form.service === 'clothing' && (
            <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-syne font-bold text-text text-base">Product Variants</h2>
                <button onClick={addVariant} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-clothing/10 border border-clothing/25 text-clothing text-xs font-semibold hover:bg-clothing/15 transition-all">
                  <Plus size={13} /> Add Variant
                </button>
              </div>
              {variants.length === 0 && <p className="text-xs text-text-3">No variants yet. Add size/color combinations.</p>}
              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-4 gap-3 mb-3 items-end">
                  {[['Color', 'color', 'Red, Blue…'], ['Size', 'size', 'S, M, L…'], ['Price (₹)', 'price', '999'], ['Stock', 'stock', '50']].map(([l, k, p]) => (
                    <div key={k}>
                      <label className="text-[10px] font-semibold text-text-3 uppercase tracking-wide block mb-1">{l}</label>
                      <input value={v[k as keyof typeof v]} onChange={e => setVariants(vs => vs.map((x, j) => j === i ? { ...x, [k]: e.target.value } : x))}
                        placeholder={p} className="w-full bg-bg-3 border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-white/20" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Images */}
          <div className="bg-card border border-white/[0.07] rounded-2xl p-6">
            <h2 className="font-syne font-bold text-text text-base mb-4">Product Images</h2>
            <div className="border-2 border-dashed border-white/[0.12] rounded-xl p-8 text-center hover:border-white/25 transition-colors cursor-pointer" onClick={() => toast('Image upload would open file picker')}>
              <Upload size={28} className="mx-auto mb-3 text-text-3" />
              <p className="text-sm text-text-2 font-medium">Click to upload images</p>
              <p className="text-xs text-text-3 mt-1">PNG, JPG up to 5MB each · Max 5 images</p>
            </div>
          </div>

          {/* Save */}
          <div className="flex gap-3">
            <button onClick={() => router.push('/vendor')} className="px-6 py-3.5 rounded-xl bg-bg-3 border border-white/[0.07] text-text text-sm font-medium hover:bg-bg-4 transition-all">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-3.5 rounded-xl bg-food text-white font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60 transition-all">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={16} />}
              {saving ? 'Saving…' : 'Add Product'}
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
