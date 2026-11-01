// PROFESSIONAL - Single source of truth for Supabase
// NEVER hardcode keys in HTML - use env
// For Vercel: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Environment Variables

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || window.__ENV__?.SUPABASE_URL || "https://xwhsnpuqmbnlhcsmuhjf.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || window.__ENV__?.SUPABASE_ANON_KEY || "sb_publishable_yKL07vQkiOGecLvYHwjWIg_NIScmtDj";

if(!SUPABASE_URL || !SUPABASE_ANON_KEY){
  console.error("Missing Supabase env keys - set them in .env file");
}

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true }
});
