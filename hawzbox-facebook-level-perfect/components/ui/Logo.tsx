
'use client'
import { APP_CONFIG } from '@/config'
export default function Logo({size=80, showInstall=false, onTap}: {size?:number, showInstall?:boolean, onTap?:()=>void}){
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        onClick={onTap}
        className={`bg-black rounded-[18px] overflow-hidden cursor-pointer active:scale-95 transition flex items-center justify-center border border-[#1A1A1A] ${showInstall ? 'ring-2 ring-[#B1EB01]/30' : ''}`}
        style={{width:size, height:size}}
      >
        <img src={APP_CONFIG.logo} alt="HawzBox Logo" className="w-full h-full object-contain p-2" />
      </div>
      {showInstall && <span className="text-[9px] bg-[#B1EB01] text-black font-bold px-2 py-0.5 rounded-full animate-pulse">TAP TO INSTALL</span>}
    </div>
  )
}
