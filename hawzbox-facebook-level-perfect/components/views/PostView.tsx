
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { compressImage } from '@/lib/image'
import { APP_CONFIG, NIGERIA_STATES } from '@/config'

export default function PostView({onClose, onPosted}:{onClose:()=>void, onPosted:()=>void}){
  const [loading,setLoading]=useState(false)
  const [files,setFiles]=useState<File[]>([])
  const [form,setForm]=useState({title:'',price:'',area:'Choba',state:'Rivers State',address:'',housetype:APP_CONFIG.houseTypes[0],type:'For Rent' as any,amenities:''})
  const states = Object.keys(NIGERIA_STATES)
  const areas = NIGERIA_STATES[form.state] || []

  const handlePost=async()=>{
    if(!form.price||!form.address||files.length===0) return alert('Add price, address and 1 photo')
    setLoading(true)
    try{
      const urls:string[]=[]
      for(let i=0;i<files.length;i++){
        const comp=await compressImage(files[i])
        const name=`images/${Date.now()}_${i}.jpg`
        const {error}=await supabase.storage.from('house-images').upload(name,comp)
        if(error) throw error
        const {data}=supabase.storage.from('house-images').getPublicUrl(name)
        urls.push(data.publicUrl)
      }
      const {data:{user}}=await supabase.auth.getUser()
      const payload={title:form.title||`${form.housetype} in ${form.area}`, price:Number(form.price), area:form.area, state:form.state, address:form.address, housetype:form.housetype, type:form.type, amenities:form.amenities.split(',').map(s=>s.trim()).filter(Boolean), images:urls, owner_id:user?.id||'guest', owner_name:user?.user_metadata?.full_name||'Verified User', taken:false}
      const {error}=await supabase.from('posts').insert([payload])
      if(error) throw error
      onPosted(); onClose()
    }catch(e:any){ alert(e.message) } finally{ setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black z-[70] max-w-[430px] mx-auto overflow-y-auto">
      <div className="sticky top-0 bg-black border-b border-[#111] p-5 flex justify-between items-center">
        <div><h2 className="font-extrabold text-[20px]">MAKE A POST</h2><p className="text-[12px] text-zinc-500">Facebook level • Compressed like IG</p></div>
        <button onClick={onClose} className="w-9 h-9 bg-[#1A1A1A] rounded-full">✕</button>
      </div>
      <div className="p-5 space-y-4 pb-32">
        <div className="grid grid-cols-2 gap-3">
          <select value={form.state} onChange={e=>setForm({...form,state:e.target.value, area:''})} className="bg-[#161616] border border-[#252525] rounded-2xl p-4 text-[13px]">{states.map(s=><option key={s}>{s}</option>)}</select>
          <select value={form.area} onChange={e=>setForm({...form,area:e.target.value})} className="bg-[#161616] border border-[#252525] rounded-2xl p-4 text-[13px]"><option value="">Select Area</option>{areas.map(a=><option key={a}>{a}</option>)}<option value={form.area}>{form.area}</option></select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select value={form.housetype} onChange={e=>setForm({...form,housetype:e.target.value})} className="bg-[#161616] border border-[#252525] rounded-2xl p-4 text-[13px]">{APP_CONFIG.houseTypes.map(t=><option key={t}>{t}</option>)}</select>
          <select value={form.type} onChange={e=>setForm({...form,type:e.target.value as any})} className="bg-[#161616] border border-[#252525] rounded-2xl p-4 text-[13px]">{APP_CONFIG.listingTypes.map(t=><option key={t}>{t}</option>)}</select>
        </div>
        <input placeholder="Price e.g 350000" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full bg-[#161616] border border-[#252525] rounded-2xl px-5 py-4 text-[14px]"/>
        <input placeholder="Full Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="w-full bg-[#161616] border border-[#252525] rounded-2xl px-5 py-4 text-[14px]"/>
        <input placeholder="Title (optional)" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full bg-[#161616] border border-[#252525] rounded-2xl px-5 py-4 text-[14px]"/>
        <input placeholder="Amenities comma separated" value={form.amenities} onChange={e=>setForm({...form,amenities:e.target.value})} className="w-full bg-[#161616] border border-[#252525] rounded-2xl px-5 py-4 text-[13px]"/>
        <div><p className="text-[12px] font-bold mb-2">Photos (compressed automatically like Instagram)</p><input type="file" multiple accept="image/*" onChange={e=>setFiles(Array.from(e.target.files||[]))} className="w-full text-[12px] text-zinc-400"/><div className="grid grid-cols-3 gap-2 mt-2">{files.map((f,i)=><img key={i} src={URL.createObjectURL(f)} className="h-20 w-full object-cover rounded-lg" alt="preview"/>)}</div></div>
        <button disabled={loading} onClick={handlePost} className="w-full font-extrabold py-[18px] rounded-full text-[15px] disabled:opacity-50 text-black" style={{background:APP_CONFIG.colors.primary}}>{loading?'POSTING...':'POST NOW • LIVE'}</button>
      </div>
    </div>
  )
}
