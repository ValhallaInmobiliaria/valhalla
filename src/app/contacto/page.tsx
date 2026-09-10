import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { buildWhatsAppUrl, SITE } from "@/lib/site";

export const metadata = {
  title: "Contacto | Valhalla Inmobiliaria",
  description:
    "Contacta a Valhalla Inmobiliaria para recibir información sobre propiedades, ventas, arriendos y servicios inmobiliarios.",
};

export default function ContactoPage() {
  const ventasWhatsAppUrl = buildWhatsAppUrl(
    "Hola, Valhalla Inmobiliaria. Quiero recibir información sobre ventas y propiedades para comprar.",
    "ventas"
  );
  const arriendosWhatsAppUrl = buildWhatsAppUrl(
    "Hola, Valhalla Inmobiliaria. Quiero recibir información sobre arriendos.",
    "arriendos"
  );

  return (
    <main className="min-h-screen bg-[#F3F7FC]">
      <Navbar />

      {/* HERO */}
      <section className="bg-[#0016A2] text-white">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-[#79C2EF]"
          >
            <ArrowLeft size={16} />
            Inicio
          </Link>

          <div className="mt-10 max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#79C2EF]">
              Contacto
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">
              Hablemos de tu próximo paso.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Si estás buscando una propiedad o quieres vender o arrendar la
              tuya, puedes comunicarte directamente con Valhalla Inmobiliaria.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* CONTACTO PRINCIPAL */}
          <div className="rounded-[2rem] bg-white p-7 shadow-[0_20px_60px_rgba(0,22,162,0.07)] sm:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#0016A2]">
              Atención directa
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#0016A2] sm:text-4xl">
              Cuéntanos qué necesitas.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-500">
              Si quieres conocer una propiedad, vender o arrendar un inmueble,
              puedes comunicarte directamente con nuestro equipo a través de
              WhatsApp.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={ventasWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0016A2] px-6 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#79C2EF] hover:text-[#0016A2]"
              >
                <MessageCircle size={19} />
                WhatsApp Ventas
                <ArrowUpRight size={16} />
              </a>
              <a
                href={arriendosWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0016A2]/15 bg-white px-6 py-4 text-sm font-extrabold text-[#0016A2] transition hover:border-[#79C2EF] hover:bg-[#F3F7FC]"
              >
                <MessageCircle size={19} />
                WhatsApp Arriendos
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          {/* DATOS DE CONTACTO */}
          <div className="space-y-4">
            <ContactCard
              icon={<MessageCircle size={20} />}
              title="WhatsApp Ventas"
              description="Compra una propiedad o consulta inmuebles en venta."
              href={ventasWhatsAppUrl}
              label="Abrir WhatsApp Ventas"
            />

            <ContactCard
              icon={<MessageCircle size={20} />}
              title="WhatsApp Arriendos"
              description="Encuentra una propiedad para arrendar."
              href={arriendosWhatsAppUrl}
              label="Abrir WhatsApp Arriendos"
            />

            <ContactCard
              icon={<Mail size={20} />}
              title="Correo"
              description={SITE.email}
              href={`mailto:${SITE.email}`}
              label="Enviar correo"
            />

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#79C2EF]/20 text-[#0016A2]">
                <MapPin size={20} />
              </div>

              <h3 className="mt-5 text-lg font-black text-[#0016A2]">
                Ubicación
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {SITE.country}
              </p>
            </div>
          </div>
        </div>

        {/* REDES SOCIALES */}
        <div className="mt-8 rounded-[2rem] bg-[#0016A2] p-7 text-white sm:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#79C2EF]">
                Redes sociales
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Sigue a Valhalla Inmobiliaria.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">
                Conoce nuestras propiedades, novedades y contenido
                inmobiliario a través de nuestras redes sociales.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* INSTAGRAM */}
              <SocialButton
                href={SITE.social.instagram}
                label="Instagram"
                icon={<span className="text-sm font-black">IG</span>}
              />

              {/* FACEBOOK */}
              <SocialButton
                href={SITE.social.facebook}
                label="Facebook"
                icon={<span className="text-sm font-black">f</span>}
              />

              {/* TIKTOK */}
              <SocialButton
                href={SITE.social.tiktok}
                label="TikTok"
                icon={<span className="text-xs font-black">TT</span>}
              />
            </div>
          </div>
        </div>

        {/* WHATSAPP CTA */}
        <div className="mt-8 overflow-hidden rounded-[2rem] bg-[#79C2EF] p-7 sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#0016A2]">
                Atención personalizada
              </p>

              <h2 className="mt-3 text-3xl font-black text-[#0016A2]">
                ¿Tienes alguna pregunta?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-[#0016A2]/70">
                Nuestro canal de WhatsApp está disponible para ayudarte con
                propiedades, ventas, arriendos y asesoría inmobiliaria.
              </p>
            </div>

            <a
              href={ventasWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0016A2] px-6 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-white hover:text-[#0016A2]"
            >
              <MessageCircle size={19} />
              Contactar ahora
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* =========================================================
   CONTACT CARD
========================================================= */

function ContactCard({
  icon,
  title,
  description,
  href,
  label,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  const isExternal = href.startsWith("http");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#79C2EF]/20 text-[#0016A2]">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-black text-[#0016A2]">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>

      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#0016A2] transition hover:text-[#79C2EF]"
      >
        {label}

        <ArrowUpRight size={15} />
      </a>
    </div>
  );
}

/* =========================================================
   SOCIAL BUTTON
========================================================= */

function SocialButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#79C2EF] hover:text-[#0016A2]"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10">
        {icon}
      </span>

      {label}
    </a>
  );
}