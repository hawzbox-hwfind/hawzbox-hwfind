
'use client'
import { useEffect, useState } from 'react'
import { supabase, AdminSettings } from '@/lib/supabase'
export function useAdminSettings(){
  const [settings,setSettings]=useState<AdminSettings|null>(null)
  useEffect(()=>{
    supabase.from('admin_settings').select('*').eq('id',1).single().then(({data})=>{
      if(data) setSettings(data as AdminSettings)
      else setSettings({id:1, pay_to_view_enabled:true, pay_to_view_amount:500, pay_to_post_enabled:false, pay_to_post_amount:1000, paystack_public_key:''})
    })
  },[])
  return settings
}
