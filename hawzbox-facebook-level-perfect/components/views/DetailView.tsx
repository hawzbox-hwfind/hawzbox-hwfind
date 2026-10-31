
'use client'
import { useState } from 'react'
import { Post } from '@/lib/supabase'
import { APP_CONFIG } from '@/config'
import { supabase } from '@/lib/supabase'
import { useAdminSettings } from '@/hooks/useAdminSettings'

export default function DetailView({post, onClose, onContact}:{post:Post, onClose:()=>void, onContact:(p:Post)=>void}){
  const settings = useAdminSettings()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [hasPaid, setHasPaid] = useState(false)
  const payToViewEnabled = settings?.pay_to_view_enabled ?? APP_CONFIG.payToView.enabled
  const payAmount = settings?.pay_to_view_amount ?? APP_CONFIG.payToView.amount

  const handlePay = async ()=>{
    const email = (await supabase.auth.getUser()).data.user?.email || 'guest@hawzbox.com'
    const publicKey = settings?.paystack_public_key || ''
    if(!publicKey) { alert('Paystack not configured - contact admin'); setHasPaid(true); return }
    // @ts-ignore
    if(typeof window.PaystackPop === 'undefined'){ alert('Paystack script not loaded'); setHasPaid(true); return }
    // @ts-ignore
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount: payAmount * 100,
      currency: 'NGN',
      callback: function(response:any){
        supabase.from('payments').insert([{post_id:post.id, amount:payAmount, email, reference:response.reference, type:'view'}]).then(()=>{})
        setHasPaid(true)
      },
      onClose: function(){}
    })
    handler.openIframe()
  }

  const showPaywall = payToViewEnabled && !hasPaid

  return (
    <div className="fixed inset-0 bg-black z-[60] max-w-[430px] mx-auto overflow-y-auto">
      <div className="sticky top-0 bg-black/90 backdrop-blur border-b border-[#111] p-3 flex justify-between items-center z-10">
        <button onClick={onClose} className="w-9 h-9 bg-[#1A1A1A] rounded-full">←</button>
        <div className="flex gap-2"><button className="w-9 h-9 bg-[#1A1A1A] rounded-full">♡</button><button className="w-9 h-9 bg-[#1A1A1A] rounded-full">⋯</button></div>
      </div>

      <div className="relative h-[320px] bg-zinc-900">
        <img src={post.images?.[currentIdx] || '/logo.png'} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {post.images?.map((_,i)=><div key={i} className={`w-1.5 h-1.5 rounded-full ${i===currentIdx?'bg-[#B1EB01]':'bg-white/40'}`} />)}
        </div>
        <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center px-3">
          <button onClick={()=>setCurrentIdx(Math.max(0,currentIdx-1))} className="w-8 h-8 bg-black/50 rounded-full">‹</button>
          <button onClick={()=>setCurrentIdx(Math.min((post.images?.length||1)-1, currentIdx+1))} className="w-8 h-8 bg-black/50 rounded-full">›</button>
        </div>
      </div>

      <div className="p-5 space-y-4 pb-32">
        <div>
          <h2 className="font-bold text-[18px]">{post.title}</h2>
          <p className="font-extrabold text-[20px] mt-1" style={{color:APP_CONFIG.colors.primary}}>₦{Number(post.price).toLocaleString()}</p>
          <p className="text-[12px] text-zinc-500 mt-1">{post.address} • {post.area}, {post.state}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#161616] border border-[#252525] rounded-2xl p-3"><p className="text-[10px] text-zinc-500">HOUSE TYPE</p><p className="text-[13px] font-bold mt-1">{post.housetype}</p></div>
          <div className="bg-[#161616] border border-[#252525] rounded-2xl p-3"><p className="text-[10px] text-zinc-500">LISTING</p><p className="text-[13px] font-bold mt-1">{post.type}</p></div>
        </div>

        <div><p className="text-[12px] font-bold">Amenities</p><div className="flex flex-wrap gap-2 mt-2">{post.amenities?.map((a,i)=><span key={i} className="text-[11px] bg-[#1E1E1E] border border-[#2A2A2A] px-3 py-1.5 rounded-full">{a}</span>)}</div></div>

        {showPaywall ? (
          <div className="bg-[#111] border border-[#B1EB01]/20 rounded-[20px] p-4">
            <p className="text-[13px] font-bold">🔒 Pay to view owner contact</p>
            <p className="text-[11px] text-zinc-500 mt-1">Pay ₦{payAmount} to see phone & WhatsApp — controlled LIVE by admin</p>
            <button onClick={handlePay} className="w-full mt-3 font-bold py-3.5 rounded-full text-black" style={{background:APP_CONFIG.colors.primary}}>Pay ₦{payAmount} to View Contact</button>
          </div>
        ) : (
          <button onClick={()=>onContact(post)} className="w-full font-bold py-4 rounded-full text-black" style={{background:APP_CONFIG.colors.primary}}>View Owner Contact • Call & WhatsApp</button>
        )}
      </div>
    </div>
  )
}
