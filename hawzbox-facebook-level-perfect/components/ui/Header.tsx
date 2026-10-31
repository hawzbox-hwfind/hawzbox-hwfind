
'use client'
import { APP_CONFIG } from '@/config'
import Logo from './Logo'
export default function Header({onInstallTap, showInstall}:{onInstallTap:()=>void, showInstall:boolean}){
  return (
    <div className="sticky top-0 z-30 bg-black border-b border-[#111] px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl overflow-hidden bg-black border border-[#1A1A1A]"><img src={APP_CONFIG.logo} alt="logo" className="w-full h-full object-contain" /></div>
        <h1 className="font-extrabold text-[20px] tracking-tight">{APP_CONFIG.appName}<span style={{color:APP_CONFIG.colors.primary}}>Box</span></h1>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onInstallTap} className={`w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center ${showInstall?'ring-2 ring-[#B1EB01]':''}`} title="Add to Desktop"><span className="text-[14px]">📲</span></button>
        <a href="/admin" className="text-[10px] bg-[#161616] border border-[#252525] px-3 py-1.5 rounded-full">Admin →</a>
      </div>
    </div>
  )
}
