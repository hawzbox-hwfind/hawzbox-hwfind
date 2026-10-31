
'use client'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { APP_CONFIG } from '@/config'
export default function InstallPrompt(){
  const { showInstall, install } = usePWAInstall()
  if(!showInstall) return null
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#B1EB01] text-black font-bold text-[13px] px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-bounce">
      <img src={APP_CONFIG.logo} alt="logo" className="w-6 h-6 rounded-full bg-black p-1" />
      <span>Install HawzBox to Desktop</span>
      <button onClick={install} className="ml-2 bg-black text-[#B1EB01] px-3 py-1 rounded-full text-[11px]">Install</button>
    </div>
  )
}
