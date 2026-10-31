
import { createClient } from '@supabase/supabase-js'
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
export const supabase = createClient(url, anon, { auth: { persistSession: true } })
export type Post = { id:string; title:string; price:number; area:string; state:string; address:string; housetype:string; type:string; amenities:string[]; images:string[]; videourl?:string; owner_id:string; owner_name:string; owner_phone:string; owner_whatsapp:string; created_at:string; taken:boolean; }
export type AdminSettings = { id:number; pay_to_view_enabled:boolean; pay_to_view_amount:number; pay_to_post_enabled:boolean; pay_to_post_amount:number; paystack_public_key:string; }
