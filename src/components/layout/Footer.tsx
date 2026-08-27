"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { SITE, buildWhatsAppUrl } from "@/lib/site";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Propiedades", href: "/propiedades" },
  { name: "Servicios", href: "/#servicios" },
  { name: "Nosotros", href: "/#nosotros" },
  { name: "Contacto", href: "/contacto" },
];

export default function Footer() {
  const whatsappUrl = buildWhatsAppUrl(
    "Hola, Valhalla Inmobiliaria. Quiero recibir información sobre sus servicios."
  );

  return (
    <footer className="bg-[#0016A2] text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.45fr_0.8fr_0.9fr_1fr]">
          <div>
            <Link
              href="/"
              className="group inline-flex items-center"
              aria-label={SITE.name}
            >
              <div className="relative h-[112px] w-[300px] overflow-hidden rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-[1.015] sm:h-[122px] sm:w-[330px]">
                <Image
                  src="/images/logo-valhalla.png"
                  alt={SITE.name}
                  fill
                  sizes="330px"
                  className="object-contain"
                />
              </div>
            </Link>

            <p className="mt-6 max-w-md text-[15px] leading-7 text-white/75">
              Soluciones inmobiliarias para comprar, vender y arrendar con
              confianza, acompañamiento y atención personalizada.
            </p>

            <div className="mt-7 space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-white/80 transition hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <MessageCircle size={17} />
                </span>
                WhatsApp
              </a>

              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-3 text-sm text-white/80 transition hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Mail size={17} />
                </span>
                {SITE.email}
              </a>

              <div className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <MapPin size={17} />
                </span>
                {SITE.country}
              </div>
            </div>
          </div>

          <FooterColumn title="Navegación">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center gap-1 text-[15px] text-white/70 transition hover:text-white"
              >
                {item.name}
                <ArrowUpRight
                  size={14}
                  className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                />
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Síguenos">
            <SocialLink
              href={SITE.social.instagram}
              label="Instagram"
              icon={<span className="text-sm font-black">IG</span>}
            />
            <SocialLink
              href={SITE.social.facebook}
              label="Facebook"
              icon={<span className="text-sm font-black">f</span>}
            />
            <SocialLink
              href={SITE.social.tiktok}
              label="TikTok"
              icon={<span className="text-xs font-black">TT</span>}
            />
          </FooterColumn>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white">
              ¿Tienes una propiedad?
            </p>
            <p className="mt-5 text-[15px] leading-7 text-white/70">
              Podemos ayudarte a venderla o arrendarla. Hablemos sobre tu
              propiedad.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#79C2EF] px-5 py-3.5 text-sm font-bold text-[#0016A2] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl"
            >
              <MessageCircle size={18} />
              Hablar por WhatsApp
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        <div className="mt-14 border-t border-white/15 pt-7">
          <div className="flex flex-col gap-4 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} {SITE.name}. Todos los derechos
              reservados.
            </p>

            <div className="flex gap-5">
              <Link href="/contacto" className="transition hover:text-white">
                Contacto
              </Link>
              <Link href="/" className="transition hover:text-white">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
        {title}
      </h3>
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}

function SocialLink({
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
      className="group flex items-center gap-3 text-[15px] text-white/70 transition hover:text-white"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-[#79C2EF] group-hover:text-[#0016A2]">
        {icon}
      </span>
      {label}
    </a>
  );
}
