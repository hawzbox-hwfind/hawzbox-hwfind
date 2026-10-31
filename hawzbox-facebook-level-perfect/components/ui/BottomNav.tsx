
'use client'
import { APP_CONFIG } from '@/config'
type Tab='feed'|'areas'|'chat'|'profile'|'post'
export default function BottomNav({active, onChange}:{active:Tab, onChange:(t:Tab)=>void}){
  const item=(id:Tab,label:string,icon:React.ReactNode)=><button onClick={()=>onChange(id)} className={`flex flex-col items-center gap-1 flex-1 ${active===id?'text-[#B1EB01]':'text-white'}`}><div className="w-6 h-6 flex items-center justify-center">{icon}</div><span className={`text-[10px] ${active===id?'font-bold text-[#B1EB01]':'font-medium'}`}>{label}</span></button>
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-[#111] border-t border-[#1A1A1A] h-[84px] flex justify-between items-end px-2 pb-3 rounded-t-[18px] z-40">
      {item('feed','Home',<svg width="22" height="22" viewBox="0 0 24 24" fill={active==='feed'?APP_CONFIG.colors.primary:'none'} stroke={active==='feed'?APP_CONFIG.colors.primary:'white'} strokeWidth="1.8"><path d="M12 2.2L2.5 9.5V20.5C2.5 21.33 3.17 22 4 22H9C9.55 22 10 21.55 10 21V14.5C10 13.67 10.67 13 11.5 13H12.5C13.33 13 14 13.67 14 14.5V21C14 21.55 14.45 22 15 22H20C20.83 22 21.5 21.33 21.5 20.5V9.5L12 2.2Z"/></svg>)}
      {item('areas','Areas',<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 4.69 5 8.5C5 12.5 12 21 12 21C12 21 19 12.5 19 8.5C19 4.69 15.87 2 12 2Z" fill={active==='areas'?APP_CONFIG.colors.primary:'none'} stroke={active==='areas'?APP_CONFIG.colors.primary:'white'} strokeWidth="1.8"/><circle cx="12" cy="8.5" r="2.5" fill={active==='areas'?'black':'white'}/></svg>)}
      <div className="flex-1 flex justify-center"><div className="absolute left-1/2 -translate-x-1/2 -top-9 w-[88px] h-[88px] bg-black rounded-full flex items-center justify-center"><button onClick={()=>onChange('post')} className="w-[62px] h-[62px] rounded-full flex items-center justify-center active:scale-95 transition" style={{background:APP_CONFIG.colors.primary}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="black" strokeWidth="2.5" strokeLinecap="round"/></svg></button></div></div>
      {item('chat','Chat',<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 5.5C4 4.12 5.12 3 6.5 3H17.5C18.88 3 20 4.12 20 5.5V11.5C20 12.88 18.88 14 17.5 14H11L7.5 18.5V14H6.5C5.12 14 4 12.88 4 11.5V5.5Z" fill={active==='chat'?APP_CONFIG.colors.primary:'none'} stroke={active==='chat'?APP_CONFIG.colors.primary:'white'} strokeWidth="1.8"/></svg>)}
      {item('profile','Profile',<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7.5" r="3.5" fill={active==='profile'?APP_CONFIG.colors.primary:'none'} stroke={active==='profile'?APP_CONFIG.colors.primary:'white'} strokeWidth="1.8"/><path d="M5 19.5C5 15.5 8 13 12 13C16 13 19 15.5 19 19.5" stroke={active==='profile'?APP_CONFIG.colors.primary:'white'} strokeWidth="1.8" strokeLinecap="round"/></svg>)}
    </div>
  )
}
