"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import { SITE, buildWhatsAppUrl } from "@/lib/site";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Propiedades", href: "/propiedades" },
  { name: "Servicios", href: "/#servicios" },
  { name: "Nosotros", href: "/#nosotros" },
  { name: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const ventasWhatsAppUrl = buildWhatsAppUrl(
    "Hola, Valhalla Inmobiliaria. Quiero recibir información sobre propiedades en venta.",
    "ventas"
  );
  const arriendosWhatsAppUrl = buildWhatsAppUrl(
    "Hola, Valhalla Inmobiliaria. Quiero recibir información sobre propiedades en arriendo.",
    "arriendos"
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={`sticky top-0 z-[100] w-full border-b border-slate-200/80 bg-white/92 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "shadow-[0_10px_35px_rgba(15,23,42,0.08)]" : ""
      }`}
    >
      <div className="mx-auto flex h-[86px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[94px] lg:px-10">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="relative flex h-[72px] w-[210px] shrink-0 items-center sm:h-[78px] sm:w-[235px] lg:h-[82px] lg:w-[260px]"
          aria-label={`${SITE.name} - Inicio`}
        >
          <Image
            src="/images/logo-valhalla.png"
            alt={SITE.name}
            fill
            priority
            sizes="(max-width: 640px) 210px, (max-width: 1024px) 235px, 260px"
            className="object-contain object-left"
          />
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 lg:flex"
        >
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative rounded-full px-4 py-2.5 text-[14px] font-semibold transition-all duration-200 ${
                index === 0
                  ? "text-[#0016A2]"
                  : "text-slate-600 hover:bg-[#F3F7FC] hover:text-[#0016A2]"
              }`}
            >
              {item.name}
              <span
                className={`absolute bottom-1.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-[#79C2EF] transition-all duration-200 ${
                  index === 0
                    ? "w-5"
                    : "w-0 group-hover:w-5"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={ventasWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#0016A2]/15 bg-white px-4 py-3 text-xs font-extrabold text-[#0016A2] transition hover:border-[#79C2EF] hover:bg-[#F3F7FC]"
          >
            <MessageCircle size={17} />
            Ventas
          </a>
          <a
            href={arriendosWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-[#0016A2] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#0016A2]/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#79C2EF] hover:text-[#0016A2] hover:shadow-xl"
          >
            <MessageCircle size={19} strokeWidth={2.2} />
            Arriendos
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0016A2] shadow-sm transition hover:border-[#79C2EF] hover:bg-[#F3F7FC] lg:hidden"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-slate-100 bg-white transition-[max-height,opacity] duration-300 lg:hidden ${
          isOpen
            ? "max-h-[520px] opacity-100"
            : "pointer-events-none max-h-0 border-t-0 opacity-0"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-5 pb-6 pt-2 sm:px-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between border-b border-slate-100 py-4 text-base font-semibold text-slate-700 transition hover:text-[#0016A2]"
            >
              {item.name}
              <ChevronRight size={17} className="text-slate-300" />
            </Link>
          ))}

          <div className="mt-5 grid grid-cols-2 gap-2">
            <a
              href={ventasWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full border border-[#0016A2]/15 bg-white px-4 py-3.5 text-sm font-extrabold text-[#0016A2] shadow-sm transition hover:bg-[#F3F7FC]"
            >
              <MessageCircle size={18} />
              Ventas
            </a>
            <a
              href={arriendosWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-[#0016A2] px-4 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#79C2EF] hover:text-[#0016A2]"
            >
              <MessageCircle size={18} />
              Arriendos
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
