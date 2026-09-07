export const SITE = {
  name: "Valhalla Inmobiliaria",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573008290020",
  email: "valhallainmobiliariazipaquira@gmail.com",
  country: "Zipaquirá,Cundinamarca Colombia",
  social: {
    instagram: "https://www.instagram.com/valhallainmobiliaria/",
    facebook: "https://www.facebook.com/ValhallaInmobiliaria09",
    tiktok: "https://www.tiktok.com/@valhallainmobiliaria",
  },
  colors: {
    primary: "#0016A2",
    secondary: "#79C2EF",
    surface: "#F3F7FC",
  },
} as const;

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
