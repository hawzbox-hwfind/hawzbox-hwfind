
import './globals.css'
export const metadata = {
  title: 'HawzBox - Find Houses in Nigeria',
  description: 'Find Houses in Nigeria - Professional LIVE',
  manifest: '/manifest.json',
  themeColor: '#B1EB01',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}
export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet"/>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script src="https://js.paystack.co/v1/inline.js" async></script>
      </head>
      <body className="max-w-[430px] mx-auto bg-black min-h-screen relative">{children}</body>
    </html>
  )
}
