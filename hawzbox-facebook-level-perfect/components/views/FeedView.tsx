
'use client'
import { Post } from '@/lib/supabase'
import { APP_CONFIG } from '@/config'
function Card({post, onClick}:{post:Post, onClick:()=>void}){
  return (
    <div onClick={onClick} className="bg-[#161616] border border-[#252525] rounded-[18px] overflow-hidden active:scale-[0.98] transition cursor-pointer">
      <div className="relative h-[170px] bg-zinc-900">
        <img src={post.images?.[0] || '/logo.png'} alt={post.title} loading="lazy" className="w-full h-full object-cover" />
        {post.videourl && <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur border border-white/10 px-2 py-1 rounded-full text-[9px] flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/>VIDEO</div>}
        {post.taken && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="bg-white text-black text-[11px] font-bold px-3 py-1 rounded-full">TAKEN</span></div>}
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-[13px] line-clamp-1">{post.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-[13px]" style={{color:APP_CONFIG.colors.primary}}>₦{Number(post.price).toLocaleString()}</span>
          <span className="text-[11px] text-zinc-500">{post.area}</span>
        </div>
      </div>
    </div>
  )
}
export default function FeedView({posts, loading, query, setQuery, filter, setFilter, onSelect, onRefresh}:{posts:Post[], loading:boolean, query:string, setQuery:(v:string)=>void, filter:string, setFilter:(v:any)=>void, onSelect:(p:Post)=>void, onRefresh:()=>void}){
  const filtered = posts.filter(p=>{
    const ms=!query||p.title.toLowerCase().includes(query.toLowerCase())||p.area.toLowerCase().includes(query.toLowerCase())
    const mt=filter==='All'||p.type===filter
    return ms&&mt
  })
  return (
    <div>
      <div className="px-5 py-4">
        <div className="flex gap-2">
          <div className="flex-1 bg-[#161616] border border-[#252525] rounded-full flex items-center px-4 h-11">
            <span className="text-zinc-500 mr-2">⌕</span>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search Choba, GRA..." className="bg-transparent outline-none text-[13px] w-full"/>
          </div>
          <button onClick={onRefresh} className="w-11 h-11 bg-[#1E1E1E] rounded-full">↻</button>
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto scroll-hide">
          {['All','For Rent','For Sale'].map(t=>(
            <button key={t} onClick={()=>setFilter(t)} className={`px-4 py-2 rounded-full text-[12px] font-bold border whitespace-nowrap ${filter===t?'text-black':'bg-[#1E1E1E] text-zinc-400 border-[#2A2A2A]'}`} style={filter===t?{background:APP_CONFIG.colors.primary, borderColor:APP_CONFIG.colors.primary}:{}}>{t}</button>
          ))}
          {APP_CONFIG.houseTypes.map(t=>(
            <button key={t} onClick={()=>setQuery(t)} className="px-4 py-2 rounded-full text-[12px] font-bold border whitespace-nowrap bg-[#1E1E1E] text-zinc-400 border-[#2A2A2A]">{t}</button>
          ))}
        </div>
      </div>
      <div className="px-3">
        {loading ? <div className="grid grid-cols-2 gap-3">{[1,2,3,4].map(i=><div key={i} className="bg-[#161616] rounded-[18px] h-[220px] animate-pulse"/>)}</div> : <div className="grid grid-cols-2 gap-3">{filtered.map(p=><Card key={p.id} post={p} onClick={()=>onSelect(p)} />)}</div>}
      </div>
    </div>
  )
}
