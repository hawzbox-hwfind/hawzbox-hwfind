
'use client'
import { useEffect, useState } from 'react'
export function usePWAInstall(){
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)
  useEffect(()=>{
    const handler = (e:any)=>{ e.preventDefault(); setDeferredPrompt(e); setShowInstall(true) }
    window.addEventListener('beforeinstallprompt', handler)
    return ()=> window.removeEventListener('beforeinstallprompt', handler)
  },[])
  const install = async ()=>{
    if(!deferredPrompt) return
    deferredPrompt.prompt()
    const {outcome} = await deferredPrompt.userChoice
    if(outcome==='accepted') setShowInstall(false)
    setDeferredPrompt(null)
  }
  return { showInstall, install, deferredPrompt }
}
