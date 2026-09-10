export const SITE = {
  name: "Valhalla Inmobiliaria",

  // Puedes usar el mismo número temporalmente en ambos canales.
  // En producción se recomienda definirlos por separado en .env.local / Vercel.
  whatsappVentas:
    process.env.NEXT_PUBLIC_WHATSAPP_VENTAS ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    "573102897401",
  whatsappArriendos:
    process.env.NEXT_PUBLIC_WHATSAPP_ARRIENDOS ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    "573102897401",

  email: "valhallainmobiliariazipaquira@gmail.com",
  country: "Zipaquirá,Cundinamarca",
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

export type WhatsAppChannel = "ventas" | "arriendos";

export function getWhatsAppNumber(channel: WhatsAppChannel): string {
  return channel === "arriendos"
    ? SITE.whatsappArriendos
    : SITE.whatsappVentas;
}

export function buildWhatsAppUrl(
  message: string,
  channel: WhatsAppChannel = "ventas"
) {
  return `https://wa.me/${getWhatsAppNumber(channel)}?text=${encodeURIComponent(
    message
  )}`;
}
