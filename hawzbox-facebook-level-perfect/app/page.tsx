
'use client'
import { useState } from 'react'
import { usePosts } from '@/hooks/usePosts'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { APP_CONFIG } from '@/config'
import { Post } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import BottomNav from '@/components/ui/BottomNav'
import InstallPrompt from '@/components/ui/InstallPrompt'
import Logo from '@/components/ui/Logo'
import FeedView from '@/components/views/FeedView'
import DetailView from '@/components/views/DetailView'
import AreasView from '@/components/views/AreasView'
import PostView from '@/components/views/PostView'

type Tab='feed'|'areas'|'chat'|'profile'|'post'

export default function Home(){
  const {posts, loading, refetch}=usePosts()
  const { showInstall, install } = usePWAInstall()
  const [tab,setTab]=useState<Tab>('feed')
  const [query,setQuery]=useState('')
  const [filter,setFilter]=useState('All')
  const [selectedPost,setSelectedPost]=useState<Post|null>(null)
  const [showPost,setShowPost]=useState(false)
  const [showContact,setShowContact]=useState<Post|null>(null)

  return (
    <main className="pb-[100px] min-h-screen bg-black">
      {!process.env.NEXT_PUBLIC_SUPABASE_URL && <div className="bg-[#B1EB01] text-black text-[11px] font-bold p-2.5 text-center">⚙️ Add ENV in Vercel to go LIVE — demo mode for now</div>}

      <Header onInstallTap={install} showInstall={showInstall} />

      {/* Auth Logo Section with Add to Desktop Tap - Facebook level */}
      {tab==='feed' && (
        <div className="px-5 py-6 flex flex-col items-center gap-3 border-b border-[#111]">
          <Logo size={96} showInstall={showInstall} onTap={install} />
          <div className="text-center">
            <h2 className="font-bold text-[14px]">{APP_CONFIG.appName}Box • Professional</h2>
            <p className="text-[11px] text-zinc-500 mt-1">{APP_CONFIG.appSlogan} • Tap logo to install to desktop</p>
          </div>
          {showInstall && (
            <button onClick={install} className="bg-[#B1EB01] text-black font-bold text-[12px] px-5 py-2 rounded-full flex items-center gap-2">
              <span>📲</span> Add to Desktop
            </button>
          )}
        </div>
      )}

      {tab==='feed' && <FeedView posts={posts} loading={loading} query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} onSelect={(p)=>setSelectedPost(p)} onRefresh={refetch} />}

      {tab==='areas' && <AreasView posts={posts} onSelect={(p)=>setSelectedPost(p)} />}

      {tab==='chat' && <div className="p-10 text-center"><p className="text-[14px] font-bold">Chat</p><p className="text-[11px] text-zinc-500 mt-2">Real-time chat uses chats table — coming from original main app</p></div>}

      {tab==='profile' && (
        <div className="p-5 space-y-4">
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[20px] p-4 flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#1A1A1A] overflow-hidden"><img src="/logo.png" alt="avatar" className="w-full h-full object-contain p-1" /></div>
            <div><p className="font-bold text-[14px]">Véèñ Cêñtz</p><p className="text-[11px] text-zinc-500">Port Harcourt • Verified</p></div>
          </div>
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[20px] p-4">
            <p className="text-[12px] font-bold">Easy Edit Guide (Facebook Level)</p>
            <p className="text-[11px] text-zinc-500 mt-1">• Edit config.ts to change colors, prices, phone numbers</p>
            <p className="text-[11px] text-zinc-500">• Edit components/views/FeedView.tsx to change card design</p>
            <p className="text-[11px] text-zinc-500">• Edit components/ui/Logo.tsx to change logo</p>
            <p className="text-[10px] text-zinc-600 mt-2">No more 4,742 lines in one file!</p>
          </div>
          <div className="bg-[#111] border border-[#1E1E1E] rounded-[20px] p-4">
            <p className="text-[12px] font-bold">📲 Add to Desktop</p>
            <p className="text-[11px] text-zinc-500 mt-1">Tap the logo at top or the Install button. This installs HawzBox like a real app on your phone/desktop — works offline.</p>
            {showInstall && <button onClick={install} className="w-full mt-3 bg-[#B1EB01] text-black font-bold py-3 rounded-full text-[13px]">Install Now</button>}
          </div>
        </div>
      )}

      <BottomNav active={tab} onChange={(t)=>{ if(t==='post'){ setShowPost(true); return } setTab(t) }} />

      <InstallPrompt />

      {selectedPost && <DetailView post={selectedPost} onClose={()=>setSelectedPost(null)} onContact={(p)=>{setSelectedPost(null); setShowContact(p)}} />}

      {showContact && (
        <div className="fixed inset-0 bg-black z-[70] max-w-[430px] mx-auto p-5 overflow-y-auto">
          <div className="flex justify-between items-center"><h2 className="font-bold text-[18px]">Owner Contact</h2><button onClick={()=>setShowContact(null)} className="w-9 h-9 bg-[#1A1A1A] rounded-full">✕</button></div>
          <div className="mt-8 bg-[#161616] border border-[#252525] rounded-[20px] p-5 text-center">
            <div className="w-20 h-20 bg-[#1A1A1A] rounded-full mx-auto flex items-center justify-center text-[24px]">👤</div>
            <p className="font-bold text-[16px] mt-4">{showContact.owner_name}</p>
            <p className="text-[12px] text-zinc-500 mt-1">{showContact.title}</p>
            <div className="mt-6 space-y-3">
              <a href={`tel:${showContact.owner_phone}`} className="w-full bg-[#B1EB01] text-black font-bold py-3.5 rounded-full block">📞 Call {showContact.owner_phone}</a>
              <a href={`https://wa.me/${showContact.owner_whatsapp?.replace(/[^0-9]/g,'')}`} target="_blank" className="w-full bg-[#25D366] text-white font-bold py-3.5 rounded-full block">💬 WhatsApp</a>
            </div>
          </div>
        </div>
      )}

      {showPost && <PostView onClose={()=>setShowPost(false)} onPosted={()=>refetch()} />}
    </main>
  )
}
