
'use client'
import { useState } from 'react'
import { Post } from '@/lib/supabase'
import { NIGERIA_STATES } from '@/config'
export default function AreasView({posts, onSelect}:{posts:Post[], onSelect:(p:Post)=>void}){
  const [selectedState, setSelectedState] = useState('Rivers State')
  const [showDropdown, setShowDropdown] = useState(false)
  const areas = NIGERIA_STATES[selectedState] || []
  const filtered = posts.filter(p=>p.state===selectedState)
  return (
    <div className="px-5 py-4">
      <div className="relative">
        <button onClick={()=>setShowDropdown(!showDropdown)} className="w-full bg-[#161616] border border-[#252525] rounded-2xl p-4 flex justify-between items-center text-[13px]"><span>{selectedState}</span><span>▼</span></button>
        {showDropdown && <div className="absolute top-full mt-2 w-full bg-[#161616] border border-[#252525] rounded-2xl overflow-hidden z-20 max-h-64 overflow-y-auto">{Object.keys(NIGERIA_STATES).map(s=><button key={s} onClick={()=>{setSelectedState(s); setShowDropdown(false)}} className="w-full text-left p-3 text-[13px] hover:bg-[#1E1E1E] border-b border-[#1A1A1A] last:border-0">{s}</button>)}</div>}
      </div>
      <h2 className="font-bold text-[16px] mt-6">Areas in {selectedState} <span className="text-[11px] text-zinc-500">({filtered.length} houses)</span></h2>
      <div className="grid grid-cols-2 gap-2 mt-4">{areas.map(a=>{ const count=posts.filter(p=>p.area===a).length; return <button key={a} onClick={()=>{}} className="bg-[#161616] border border-[#252525] rounded-2xl p-3 text-left"><p className="text-[13px] font-bold">{a}</p><p className="text-[10px] text-zinc-500">{count} listings</p></button> })}</div>
      <div className="mt-6 space-y-2">{filtered.map(p=><div key={p.id} onClick={()=>onSelect(p)} className="bg-[#161616] border border-[#252525] rounded-2xl p-3 flex gap-3 cursor-pointer"><img src={p.images?.[0]} className="w-16 h-16 rounded-xl object-cover" alt=""/><div><p className="text-[12px] font-bold">{p.title}</p><p className="text-[11px] text-zinc-500">₦{p.price} • {p.area}</p></div></div>)}</div>
    </div>
  )
}
