
export const APP_CONFIG = {
  appName: "HawzBox",
  appSlogan: "Find Houses in Nigeria",
  logo: "/logo.png",
  colors: { primary: "#B1EB01", background: "#000000", card: "#161616", border: "#252525", surface: "#111111" },
  payToView: { enabled: true, amount: 500 },
  payToPost: { enabled: false, amount: 1000 },
  support: { phone: "07032156113", whatsapp: "08169812007", email: "support@hawzbox.com" },
  houseTypes: ["Self Contain", "Single Room", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Duplex", "Bungalow", "Store", "Shop"],
  listingTypes: ["For Rent", "For Sale"] as const,
  admin: { allowedEmails: ["etimvincentz001@gmail.com"] },
  pwa: { enabled: true, installPrompt: true }
}
export const NIGERIA_STATES: Record<string, string[]> = {
  "Rivers State": ["Port Harcourt", "Choba", "Alakahia", "Rumukoroshe", "GRA", "Trans-Amadi", "Elelenwo", "Rumuokoro", "D-Line", "Borokiri", "Choba Extension", "Aluu", "Mgbuoba"],
  "Lagos State": ["Ikeja", "Lekki", "Yaba", "Surulere", "Victoria Island", "Ikoyi", "Ajah", "Ikorodu", "Agege", "Oshodi"],
  "Abuja FCT": ["Wuse", "Garki", "Maitama", "Asokoro", "Gwarimpa", "Kubwa", "Lugbe", "Kuje"],
  "Kano State": ["Kano Municipal", "Fagge", "Dala", "Gwale", "Nassarawa"],
  "Akwa Ibom State": ["Uyo", "Etim Ekpo", "Ikot Ekpene", "Eket", "Oron"],
}
