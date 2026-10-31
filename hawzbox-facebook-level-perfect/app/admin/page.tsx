
'use client'
import { useEffect, useState } from 'react'
import { supabase, AdminSettings } from '@/lib/supabase'
import { APP_CONFIG } from '@/config'

const ALLOWED_ADMIN_EMAILS = ["etimvincentz001@gmail.com"]

type Tab = 'overview'|'posts'|'users'|'paystack'|'broadcast'|'reports'|'banned'|'settings'

export default function AdminPage(){
  const [user,setUser]=useState<any>(null)
  const [settings,setSettings]=useState<AdminSettings|null>(null)
  const [posts,setPosts]=useState<any[]>([])
  const [users,setUsers]=useState<any[]>([])
  const [reports,setReports]=useState<any[]>([])
  const [banned,setBanned]=useState<any[]>([])
  const [broadcasts,setBroadcasts]=useState<any[]>([])
  const [tab,setTab]=useState<Tab>('overview')
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('')
  const [isAdmin,setIsAdmin]=useState(false); const [loading,setLoading]=useState(true)
  const [search,setSearch]=useState('')
  const [broadcastTitle,setBroadcastTitle]=useState(''); const [broadcastMsg,setBroadcastMsg]=useState('')

  useEffect(()=>{ checkUser() },[])

  const checkUser=async()=>{
    const {data}=await supabase.auth.getSession()
    const cu=data.session?.user||null
    setUser(cu)
    if(cu){
      const allowed=ALLOWED_ADMIN_EMAILS.includes(cu.email||'')
      setIsAdmin(allowed)
      if(allowed) loadAll()
    }
    setLoading(false)
  }

  const loadAll=async()=>{
    const {data:settingsData}=await supabase.from('admin_settings').select('*').eq('id',1).single()
    if(settingsData) setSettings(settingsData as AdminSettings)
    const {data:postsData}=await supabase.from('posts').select('*').order('created_at',{ascending:false}).limit(200)
    if(postsData) setPosts(postsData)
    const {data:reportsData}=await supabase.from('reports').select('*').order('created_at',{ascending:false}).limit(100)
    if(reportsData) setReports(reportsData)
    const {data:bannedData}=await supabase.from('banned_users').select('*').limit(100)
    if(bannedData) setBanned(bannedData)
    const {data:broadcastData}=await supabase.from('broadcasts').select('*').order('created_at',{ascending:false}).limit(50)
    if(broadcastData) setBroadcasts(broadcastData)
    // users from profiles or auth
    try{
      const {data:profiles}=await supabase.from('profiles').select('*').limit(100)
      if(profiles) setUsers(profiles)
    }catch{}
  }

  const login=async()=>{
    const {data,error}=await supabase.auth.signInWithPassword({email,password})
    if(error){alert(error.message);return}
    const le=data.user?.email||''
    if(!ALLOWED_ADMIN_EMAILS.includes(le)){
      alert(`Access Denied! Only ${ALLOWED_ADMIN_EMAILS.join(', ')} can access admin. You are ${le}`)
      await supabase.auth.signOut()
      return
    }
    setUser(data.user); setIsAdmin(true); loadAll()
  }

  const deletePost=async(id:string)=>{
    if(!confirm('Delete this post? Only you can do this - irreversible')) return
    const {error}=await supabase.from('posts').delete().eq('id',id)
    if(error) alert(error.message)
    else setPosts(posts.filter(p=>String(p.id)!==String(id)))
  }

  const toggleTaken=async(id:string, taken:boolean)=>{
    await supabase.from('posts').update({taken:!taken}).eq('id',id)
    setPosts(posts.map(p=>String(p.id)===String(id)?{...p, taken:!taken}:p))
  }

  const banUser=async(userId:string, reason:string)=>{
    if(!userId) return alert('No user ID')
    await supabase.from('banned_users').insert([{user_id:userId, reason, banned_by:user.email, created_at:new Date().toISOString()}])
    alert(`User ${userId} banned - ${reason}`)
    loadAll()
  }

  const unbanUser=async(id:string)=>{
    await supabase.from('banned_users').delete().eq('id',id)
    setBanned(banned.filter(b=>String(b.id)!==String(id)))
  }

  const savePaystack=async()=>{
    if(!settings) return
    const {error}=await supabase.from('admin_settings').update({
      pay_to_view_enabled:settings.pay_to_view_enabled,
      pay_to_view_amount:settings.pay_to_view_amount,
      pay_to_post_enabled:settings.pay_to_post_enabled,
      pay_to_post_amount:settings.pay_to_post_amount,
      paystack_public_key:settings.paystack_public_key
    }).eq('id',1)
    if(error) alert(error.message)
    else alert('Paystack LIVE saved! Main app updates instantly for all users worldwide - only you changed it!')
  }

  const sendBroadcast=async()=>{
    if(!broadcastTitle||!broadcastMsg) return alert('Add title and message')
    await supabase.from('broadcasts').insert([{title:broadcastTitle, message:broadcastMsg, created_at:new Date().toISOString()}])
    setBroadcastTitle(''); setBroadcastMsg(''); loadAll(); alert('Broadcast sent LIVE to all users!')
  }

  const deleteReport=async(id:string)=>{
    await supabase.from('reports').delete().eq('id',id)
    setReports(reports.filter(r=>String(r.id)!==String(id)))
  }

  if(loading) return <div className="min-h-screen bg-[#070707] flex items-center justify-center"><p className="text-zinc-500">Checking security for {ALLOWED_ADMIN_EMAILS[0]}...</p></div>

  if(!user) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#070707]">
      <div className="bg-[#121212] border border-[#1E1E1E] rounded-[24px] p-8 w-full max-w-[400px]">
        <div className="text-center mb-6">
          <div className="font-bold text-[26px]">HawzBox <span style={{color:APP_CONFIG.colors.primary}}>Admin Pro</span></div>
          <p className="text-[10px] text-zinc-500 mt-2 tracking-widest">SECURE • ONLY YOU • 100% LIVE</p>
          <div className="mt-4 bg-[#0F0F0F] border border-[#1E1E1E] rounded-xl p-3">
            <p className="text-[9px] text-zinc-500">ALLOWED ADMIN</p>
            <p className="text-[12px] font-bold text-[#B1EB01] mt-1">etimvincentz001@gmail.com</p>
            <p className="text-[8px] text-zinc-600 mt-1">No one else can access even if they know URL</p>
          </div>
        </div>
        <input placeholder="etimvincentz001@gmail.com" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3.5 text-[13px] outline-none focus:border-[#B1EB01]/50"/>
        <input placeholder="Your secure password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mt-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3.5 text-[13px] outline-none focus:border-[#B1EB01]/50"/>
        <button onClick={login} className="w-full mt-4 font-bold py-3.5 rounded-full text-black transition" style={{background:APP_CONFIG.colors.primary}}>Login Securely • Only You</button>
        <div className="mt-4 bg-red-900/10 border border-red-900/30 rounded-xl p-3">
          <p className="text-[10px] text-red-300 font-bold">OLD PASSWORD DISABLED</p>
          <p className="text-[9px] text-zinc-500 mt-1">hawzbox2024 no longer works. Must use Supabase Auth email + password for security.</p>
        </div>
      </div>
    </div>
  )

  if(!isAdmin) return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center p-6">
      <div className="bg-[#121212] border border-red-900/50 rounded-[24px] p-8 w-full max-w-[400px] text-center">
        <div className="text-[40px]">🚫</div>
        <h2 className="font-bold text-[18px] mt-3">Access Denied</h2>
        <p className="text-[12px] text-zinc-500 mt-2">Logged in as: {user.email}</p>
        <p className="text-[11px] text-zinc-400 mt-3">This email is NOT authorized.</p>
        <p className="text-[10px] text-zinc-600 mt-2">Only etimvincentz001@gmail.com can access admin.</p>
        <button onClick={()=>supabase.auth.signOut().then(()=>setUser(null))} className="w-full mt-6 bg-[#1A1A1A] border border-[#2A2A2A] py-3 rounded-full text-[12px]">Logout</button>
      </div>
    </div>
  )

  const filteredPosts = posts.filter(p=>!search||String(p.id).includes(search)||p.title?.toLowerCase().includes(search.toLowerCase())||p.area?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#070707]">
      {/* TOP BAR */}
      <div className="sticky top-0 z-40 bg-[#070707]/90 backdrop-blur-xl border-b border-[#1A1A1A] px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-bold text-[18px] md:text-[20px]">HawzBox <span style={{color:APP_CONFIG.colors.primary}}>Admin Pro</span></div>
          <span className="bg-[#B1EB01] text-black text-[9px] font-black px-2.5 py-1 rounded-full animate-pulse">LIVE</span>
          <span className="text-[10px] text-zinc-500 hidden md:inline">Only {user.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadAll} className="w-8 h-8 bg-[#1A1A1A] rounded-full">↻</button>
          <a href="/" className="text-[11px] bg-[#1A1A1A] px-3 py-1.5 rounded-full">← Main App</a>
          <button onClick={()=>supabase.auth.signOut().then(()=>{setUser(null); setIsAdmin(false)})} className="text-[11px] text-zinc-500 px-2">Logout</button>
        </div>
      </div>

      <div className="flex">
        {/* SIDEBAR DESKTOP - from your admin.html */}
        <div className="w-[220px] hidden md:block border-r border-[#1A1A1A] min-h-[calc(100vh-64px)] p-3 space-y-1 sticky top-[64px] h-fit">
          {[
            {id:'overview', label:'Overview', icon:'📊'},
            {id:'posts', label:`Posts ${posts.length}`, icon:'🏠'},
            {id:'users', label:`Users ${users.length}`, icon:'👥'},
            {id:'paystack', label:'Paystack LIVE', icon:'💳'},
            {id:'broadcast', label:'Broadcast', icon:'📢'},
            {id:'reports', label:`Reports ${reports.length}`, icon:'🚩'},
            {id:'banned', label:`Banned ${banned.length}`, icon:'🚫'},
            {id:'settings', label:'Settings', icon:'⚙️'},
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id as any)} className={`w-full text-left px-4 py-2.5 rounded-xl text-[12px] flex items-center gap-2 ${tab===t.id?'bg-[#B1EB01] text-black font-bold':'text-zinc-400 hover:bg-[#121212] hover:text-white'}`}><span>{t.icon}</span> {t.label}</button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <div className="md:hidden flex gap-2 overflow-x-auto scroll-hide mb-4">
            {['overview','posts','paystack','reports','banned'].map(t=>(
              <button key={t} onClick={()=>setTab(t as any)} className={`px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap ${tab===t?'text-black':'bg-[#121212] text-zinc-400 border border-[#1E1E1E]'}`} style={tab===t?{background:APP_CONFIG.colors.primary}:{}}>{t}</button>
            ))}
          </div>

          {tab==='overview' && (
            <div className="space-y-4">
              <div className="bg-green-900/10 border border-green-800/30 rounded-xl p-3"><p className="text-[11px] text-green-300 font-bold">✅ SECURE MODE — Only etimvincentz001@gmail.com can access • No one else</p></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-4"><p className="text-[10px] text-zinc-500">TOTAL POSTS</p><p className="text-[26px] font-bold">{posts.length}</p><p className="text-[10px] text-zinc-600">LIVE in main app</p></div>
                <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-4"><p className="text-[10px] text-zinc-500">REPORTS</p><p className="text-[26px] font-bold text-red-400">{reports.length}</p><p className="text-[10px] text-zinc-600">Need action</p></div>
                <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-4"><p className="text-[10px] text-zinc-500">BANNED</p><p className="text-[26px] font-bold">{banned.length}</p><p className="text-[10px] text-zinc-600">Users blocked</p></div>
                <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-4"><p className="text-[10px] text-zinc-500">ADMIN ACCESS</p><p className="text-[12px] font-bold mt-1">Only You</p><p className="text-[10px] text-zinc-500 truncate">{user.email}</p></div>
              </div>
              <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-5">
                <p className="text-[12px] font-bold">Facebook Level Modular Structure</p>
                <p className="text-[11px] text-zinc-500 mt-2">• Main app + Admin in one repo (unified) — easy to edit</p>
                <p className="text-[11px] text-zinc-500">• Edit config.ts to change colors, prices, phone numbers everywhere</p>
                <p className="text-[11px] text-zinc-500">• Edit components/views/FeedView.tsx to change card design</p>
                <p className="text-[11px] text-zinc-500">• Edit components/ui/Logo.tsx to change logo / Add to Desktop</p>
                <p className="text-[10px] text-zinc-600 mt-3">No more 4,742 lines in one file — professional like Facebook</p>
              </div>
            </div>
          )}

          {tab==='posts' && (
            <div className="space-y-3">
              <div className="flex gap-2"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search posts by ID, title, area..." className="flex-1 bg-[#121212] border border-[#1E1E1E] rounded-xl px-4 py-2.5 text-[12px]"/><button onClick={loadAll} className="bg-[#1A1A1A] border border-[#1E1E1E] px-4 py-2 rounded-xl text-[11px]">↻</button></div>
              <div className="space-y-2">{filteredPosts.map(p=><div key={p.id} className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-3 flex gap-3"><img src={p.images?.[0]||'/logo.png'} className="w-16 h-16 rounded-xl object-cover" alt=""/><div className="flex-1"><p className="text-[12px] font-bold truncate max-w-[200px]">{p.title}</p><p className="text-[11px] text-zinc-500">₦{p.price} • {p.area} • {p.state} • ID: {String(p.id).slice(0,8)}</p><div className="flex gap-2 mt-2 flex-wrap"><button onClick={()=>deletePost(p.id)} className="text-[10px] bg-red-600 text-white px-3 py-1 rounded-full font-bold">Delete (Only You)</button><button onClick={()=>toggleTaken(p.id, p.taken)} className="text-[10px] bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-1 rounded-full">{p.taken?'Mark Not Taken':'Mark Taken'}</button></div></div></div>)}</div>
            </div>
          )}

          {tab==='paystack' && settings && (
            <div className="space-y-4">
              <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-[14px]">💳 Paystack LIVE Controls — Only you can change, affects main app instantly</h3>
                <div className="flex justify-between items-center bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-3"><div><p className="text-[12px]">Pay to View Contact</p><p className="text-[10px] text-zinc-500">User pays before seeing phone</p></div><button onClick={()=>setSettings({...settings, pay_to_view_enabled:!settings.pay_to_view_enabled})} className={`w-11 h-6 rounded-full relative transition ${settings.pay_to_view_enabled?'bg-[#B1EB01]':'bg-[#2A2A2A]'}`}><div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition ${settings.pay_to_view_enabled?'left-5 bg-black':'left-0.5'}`}/></button></div>
                <div className="flex items-center gap-2"><span className="text-[11px]">Amount</span><input type="number" value={settings.pay_to_view_amount} onChange={e=>setSettings({...settings, pay_to_view_amount:Number(e.target.value)})} className="w-28 bg-[#0F0F0F] border border-[#1E1E1E] rounded-lg px-3 py-2 text-[12px]"/><span className="text-[11px]">NGN</span></div>
                <div className="flex justify-between items-center bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-3"><div><p className="text-[12px]">Pay to Post</p><p className="text-[10px] text-zinc-500">User pays before posting</p></div><button onClick={()=>setSettings({...settings, pay_to_post_enabled:!settings.pay_to_post_enabled})} className={`w-11 h-6 rounded-full relative transition ${settings.pay_to_post_enabled?'bg-[#B1EB01]':'bg-[#2A2A2A]'}`}><div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition ${settings.pay_to_post_enabled?'left-5 bg-black':'left-0.5'}`}/></button></div>
                <div className="flex items-center gap-2"><span className="text-[11px]">Post Amount</span><input type="number" value={settings.pay_to_post_amount} onChange={e=>setSettings({...settings, pay_to_post_amount:Number(e.target.value)})} className="w-28 bg-[#0F0F0F] border border-[#1E1E1E] rounded-lg px-3 py-2 text-[12px]"/><span className="text-[11px]">NGN</span></div>
                <div><label className="text-[11px] text-zinc-500">Paystack Public Key (pk_live_... or pk_test_...)</label><input value={settings.paystack_public_key||''} onChange={e=>setSettings({...settings, paystack_public_key:e.target.value})} placeholder="pk_live_..." className="w-full mt-1 bg-[#0F0F0F] border border-[#1E1E1E] rounded-xl px-4 py-3 text-[12px]"/></div>
                <div className="bg-[#B1EB01]/10 border border-[#B1EB01]/20 rounded-xl p-3"><p className="text-[11px] text-[#B1EB01] font-bold">How it works Facebook level:</p><p className="text-[10px] text-zinc-400 mt-1">When you toggle here and Save, main app at / reads admin_settings in real-time. User tries to view contact → sees paywall with your amount → pays via Paystack → contact unlocks. You control everything LIVE without redeploying.</p></div>
                <button onClick={savePaystack} className="w-full font-bold py-3.5 rounded-full text-black" style={{background:APP_CONFIG.colors.primary}}>Save LIVE • Only You Can Change This</button>
              </div>
            </div>
          )}

          {tab==='reports' && (
            <div className="space-y-3">
              <h3 className="font-bold text-[14px]">Reports ({reports.length})</h3>
              {reports.length===0?<div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-12 text-center"><div className="text-[40px]">✅</div><p className="font-bold mt-3 text-[13px]">No reports</p><p className="text-[11px] text-zinc-500">All clear!</p></div>:reports.map(r=><div key={r.id} className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-4"><div className="flex justify-between"><p className="text-[11px] font-bold text-red-300">{r.type} • {r.reason}</p><button onClick={()=>deleteReport(r.id)} className="text-zinc-500">✕</button></div><p className="text-[10px] text-zinc-500 mt-1">Post: {r.post_id} • Reporter: {r.reporter_id} • {new Date(r.created_at).toLocaleString()}</p><div className="flex gap-2 mt-3"><button onClick={()=>{deletePost(r.post_id); deleteReport(r.id)}} className="bg-red-600 text-white text-[10px] font-bold px-4 py-2 rounded-full">Delete Post</button><button onClick={()=>deleteReport(r.id)} className="bg-[#1A1A1A] border border-[#2A2A2A] text-[10px] px-4 py-2 rounded-full">Dismiss</button></div></div>)}
            </div>
          )}

          {tab==='broadcast' && (
            <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-[14px]">📢 Broadcast to All Users LIVE</h3>
              <input value={broadcastTitle} onChange={e=>setBroadcastTitle(e.target.value)} placeholder="Title e.g New Feature" className="w-full bg-[#0F0F0F] border border-[#1E1E1E] rounded-xl px-4 py-3 text-[12px]"/>
              <textarea value={broadcastMsg} onChange={e=>setBroadcastMsg(e.target.value)} placeholder="Message for all users..." className="w-full bg-[#0F0F0F] border border-[#1E1E1E] rounded-xl px-4 py-3 text-[12px] h-24"/>
              <button onClick={sendBroadcast} className="w-full font-bold py-3 rounded-full text-black" style={{background:APP_CONFIG.colors.primary}}>Send Broadcast LIVE</button>
              <div className="space-y-2 mt-4">{broadcasts.map(b=><div key={b.id} className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-3"><p className="text-[11px] font-bold">{b.title}</p><p className="text-[10px] text-zinc-400 mt-1">{b.message}</p><p className="text-[9px] text-zinc-600 mt-1">{new Date(b.created_at).toLocaleString()}</p></div>)}</div>
            </div>
          )}

          {tab==='banned' && (
            <div className="space-y-2">
              <h3 className="font-bold text-[14px]">Banned Users ({banned.length})</h3>
              {banned.map(b=><div key={b.id} className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-3 flex justify-between"><div><p className="text-[12px] font-bold">{b.user_id}</p><p className="text-[10px] text-zinc-500">{b.reason} • {new Date(b.created_at).toLocaleString()}</p></div><button onClick={()=>unbanUser(b.id)} className="text-[10px] bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-1 rounded-full">Unban</button></div>)}
            </div>
          )}

          {tab==='settings' && (
            <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-[14px]">⚙️ Settings — Easy Edit Guide</h3>
              <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-3">
                <p className="text-[11px] font-bold">To change colors, prices, phone numbers:</p>
                <p className="text-[10px] text-zinc-500 mt-2">1. Open config.ts</p>
                <p className="text-[10px] text-zinc-500">2. Change primary: #B1EB01 to any color</p>
                <p className="text-[10px] text-zinc-500">3. Change support.phone</p>
                <p className="text-[10px] text-zinc-500">4. Push to GitHub → Vercel auto deploys LIVE</p>
              </div>
              <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-3">
                <p className="text-[11px] font-bold">To change logo:</p>
                <p className="text-[10px] text-zinc-500 mt-2">Replace public/logo.png with your new logo (keep name logo.png)</p>
              </div>
              <div className="bg-[#0F0F0F] border border-[#1A1A1A] rounded-xl p-3">
                <p className="text-[11px] font-bold">Admin Security:</p>
                <p className="text-[10px] text-zinc-500 mt-2">Only etimvincentz001@gmail.com can access admin. To add another admin, edit ALLOWED_ADMIN_EMAILS in app/admin/page.tsx</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
