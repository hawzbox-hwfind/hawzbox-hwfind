
'use client'
import { useEffect, useState } from 'react'
import { supabase, Post } from '@/lib/supabase'
export function usePosts(){
  const [posts,setPosts]=useState<Post[]>([]); const [loading,setLoading]=useState(true)
  const fetchPosts=async()=>{
    setLoading(true)
    try{
      const {data, error}=await supabase.from('posts').select('*').order('created_at',{ascending:false}).limit(100)
      if(error) throw error
      if(data && data.length) setPosts(data as Post[])
      else throw new Error('empty')
    }catch{
      setPosts([
        {id:'1', title:'Self Contain in Choba - Constant Light', price:350000, area:'Choba', state:'Rivers', address:'Choba Extension PH', housetype:'Self Contain', type:'For Rent', amenities:['Water','Light','Security'], images:['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'], owner_id:'1', owner_name:'Verified Agent', owner_phone:'07032156113', owner_whatsapp:'08169812007', created_at:new Date().toISOString(), taken:false},
        {id:'2', title:'2 Bedroom in GRA Phase 2 - Spacious', price:1200000, area:'GRA', state:'Rivers', address:'GRA Phase 2 Port Harcourt', housetype:'2 Bedroom', type:'For Rent', amenities:['Security','Parking'], images:['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'], owner_id:'2', owner_name:'John Bull', owner_phone:'07032156113', owner_whatsapp:'08169812007', created_at:new Date().toISOString(), taken:false},
        {id:'3', title:'3 Bedroom Duplex in Trans-Amadi', price:2500000, area:'Trans-Amadi', state:'Rivers', address:'Trans-Amadi Industrial Layout', housetype:'Duplex', type:'For Rent', amenities:['Water','Light','Security','Parking'], images:['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], owner_id:'3', owner_name:'Grace Homes', owner_phone:'07032156113', owner_whatsapp:'08169812007', created_at:new Date().toISOString(), taken:false},
      ])
    }finally{ setLoading(false) }
  }
  useEffect(()=>{ fetchPosts() },[])
  return {posts, loading, refetch:fetchPosts}
}
