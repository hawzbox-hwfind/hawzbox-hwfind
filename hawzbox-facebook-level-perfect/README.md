
# HawzBox Facebook-Level Perfect - Modular + Add to Desktop

## What changed from your old 4,742 lines in one file?

OLD: Everything in one index.html (hard to edit, Vercel fails)
NEW: Facebook-level modular:

- config.ts -> Edit colors, prices, phone numbers in ONE place
- components/ui/Logo.tsx -> Your logo, tap to install to desktop
- components/ui/BottomNav.tsx -> Bottom nav with notch
- components/ui/Header.tsx -> Header with logo + install button
- components/ui/InstallPrompt.tsx -> Add to Desktop prompt
- components/views/FeedView.tsx -> Feed cards
- components/views/DetailView.tsx -> Detail with paywall + video
- components/views/PostView.tsx -> Post composer with compression
- components/views/AreasView.tsx -> States & areas
- hooks/usePWAInstall.ts -> PWA install logic
- hooks/usePosts.ts -> Posts fetching
- lib/supabase.ts -> Safe client (builds without ENV)
- public/manifest.json + logo.png -> PWA installable
- app/admin/page.tsx -> Secure admin ONLY etimvincentz001@gmail.com

## Logo Add to Desktop - How it works

1. public/manifest.json + public/logo.png + icon-192.png + icon-512.png
2. components/ui/Logo.tsx shows your logo, tappable
3. hooks/usePWAInstall.ts listens to beforeinstallprompt
4. Header has install button, Feed has logo tap, InstallPrompt shows banner
5. User taps logo -> Install -> HawzBox installs like real app on desktop/phone

This is Facebook level PWA.

## Deploy REAL LIVE (not demo)

1. Extract ZIP
2. Add ENV in Vercel:
   NEXT_PUBLIC_SUPABASE_URL=https://xwhsnpuqmbnlhcsmuhjf.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your anon key
3. Deploy -> REAL LIVE

## Admin Only You

Admin is locked to etimvincentz001@gmail.com via email whitelist + Supabase Auth + RLS

## Easy Edit

Edit config.ts:
- colors.primary -> change whole app color
- houseTypes -> add new house type
- payToView.amount -> change paywall price (or toggle in /admin LIVE)
- support.phone -> change phone everywhere

No more searching 4,742 lines!

