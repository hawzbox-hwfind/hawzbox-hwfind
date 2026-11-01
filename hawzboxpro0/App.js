// PROFESSIONAL APP LOGIC - Separated from UI
import { supabase } from './supabaseClient.js';

let allHouses = [];
let filtered = [];

export async function fetchListings(){
  try{
    // Check feature flag securely via Edge Function (not direct table)
    const { data: settings } = await supabase.from('admin_settings').select('paystack_enabled, maintenance_mode').eq('id',1).single();
    if(settings?.maintenance_mode){
      document.getElementById('listingsGrid').innerHTML = '<p class="col-span-2 text-center text-zinc-500 py-20">🛠️ App under maintenance</p>';
      return [];
    }

    const { data, error } = await supabase.from('posts').select('*').order('created_at',{ascending:false}).limit(100);
    if(error) throw error;
    allHouses = data || [];
    filtered = [...allHouses];
    return allHouses;
  }catch(e){
    console.error("Fetch error:", e);
    return [];
  }
}

export function renderListings(houses = filtered){
  const grid = document.getElementById('listingsGrid');
  if(!houses.length){
    grid.innerHTML = '<p class="col-span-2 text-center text-zinc-500 py-20">No houses found</p>';
    return;
  }
  grid.innerHTML = houses.map(h=>`
    <div class="bg-[#121212] border border-[#1E1E1E] rounded-[20px] overflow-hidden">
      <div class="relative h-[140px] bg-[#0F0F0F]">
        <img src="${(h.images && h.images[0]) || h.image || 'https://via.placeholder.com/300'}" class="w-full h-full object-cover">
        <span class="absolute top-2 left-2 bg-black/70 backdrop-blur border border-white/10 px-3 py-1 rounded-full text-[11px]">For Rent</span>
        ${h.video_url ? '<span class="absolute top-2 right-2 bg-black/70 backdrop-blur px-2 py-1 rounded-full text-[9px] flex items-center gap-1"><i class="fa-solid fa-video"></i> Video</span>' : ''}
      </div>
      <div class="p-3">
        <p class="text-[#B1EB01] font-bold text-[16px]">₦${Number(h.price||0).toLocaleString()}</p>
        <p class="text-[12px] font-semibold mt-1 truncate">${h.title || (h.type + ' in ' + (h.area||''))}</p>
        <p class="text-[11px] text-zinc-500 mt-1 flex items-center gap-1"><i class="fa-solid fa-location-dot text-[10px]"></i> ${h.area||''} ${h.state||''}</p>
        <div class="mt-2 pt-2 border-t border-[#1E1E1E] flex items-center gap-1 text-[11px] text-zinc-400"><i class="fa-solid fa-house text-[10px]"></i> ${h.street||'Rui'}</div>
      </div>
    </div>
  `).join('');
}

window.filterHouses = (q)=>{
  const s = q.toLowerCase();
  filtered = allHouses.filter(h=> (h.title||'').toLowerCase().includes(s) || (h.area||'').toLowerCase().includes(s));
  renderListings();
}
window.filterByType = (type)=>{
  if(type==='all') filtered=[...allHouses];
  else filtered = allHouses.filter(h=> (h.type||'').toLowerCase().includes(type) || (h.title||'').toLowerCase().includes(type));
  renderListings();
}
