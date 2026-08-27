import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Handshake,
  KeyRound,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyCatalog from "@/components/property/PropertyCatalog";
import { supabase } from "@/lib/supabase";
import { buildWhatsAppUrl } from "@/lib/site";

export default async function HomePage() {
  const { data: properties, error } = await supabase
    .from("propiedades")
    .select("*")
    .eq("publicado", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando propiedades:", error);
  }

  const propertyList = properties ?? [];
  const featuredProperties = propertyList
    .filter((property) => property.destacado)
    .slice(0, 3);

  const whatsappUrl = buildWhatsAppUrl(
    "Hola, Valhalla Inmobiliaria. Quiero recibir información sobre sus propiedades."
  );

  return (
    <main className="min-h-screen bg-[#F3F7FC] text-slate-800">
      <Navbar />

      <section className="relative overflow-hidden bg-[#F3F7FC]">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#79C2EF]/15 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#0016A2]/8 blur-3xl" />

        <div className="relative mx-auto grid min-h-[690px] max-w-[1440px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#79C2EF]/70 bg-white/80 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#0016A2] shadow-sm backdrop-blur">
              <Sparkles size={14} className="text-[#79C2EF]" />
              Valhalla Inmobiliaria
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.045em] text-[#0016A2] sm:text-6xl lg:text-[5.7rem]">
              Encuentra el lugar
              <span className="block text-[#79C2EF]">
                donde comienza tu historia.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Compra, vende o arrienda con una experiencia inmobiliaria
              cercana, transparente y pensada para ayudarte a tomar la
              decisión correcta.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#propiedades"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0016A2] px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-[#0016A2]/15 transition hover:-translate-y-0.5 hover:bg-[#79C2EF] hover:text-[#0016A2]"
              >
                Ver propiedades <ArrowRight size={17} />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0016A2]/15 bg-white px-7 py-4 text-sm font-extrabold text-[#0016A2] shadow-sm transition hover:-translate-y-0.5 hover:border-[#79C2EF] hover:bg-[#79C2EF]/15"
              >
                <MessageCircle size={18} />
                Hablar con nosotros
              </a>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-3 border-t border-slate-200 pt-6">
              <Stat
                value={String(propertyList.length)}
                label="Propiedades publicadas"
              />
              <Stat value="100%" label="Atención personalizada" />
              <Stat value="+1" label="Soluciones inmobiliarias" />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-3xl bg-[#79C2EF]/30" />
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full border border-[#79C2EF]/50" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white p-3 shadow-[0_35px_90px_rgba(0,22,162,0.13)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#e7f1f8]">
                <Image
                  src="/images/hero.jpg"
                  alt="Espacio inmobiliario de Valhalla"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 560px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0016A2]/80 via-[#0016A2]/5 to-transparent" />

                <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/20 bg-white/10 p-5 text-white backdrop-blur-md">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#79C2EF]">
                    Tu próximo espacio
                  </p>
                  <p className="mt-2 text-2xl font-black">
                    Encuentra, decide y avanza.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto -mb-8 max-w-[1180px] px-5 sm:px-8 lg:px-10">
          <div className="grid gap-3 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_25px_70px_rgba(15,23,42,0.1)] sm:grid-cols-2 lg:grid-cols-4 lg:p-5">
            <QuickAction
              number={String(propertyList.length)}
              label="Propiedades disponibles"
              href="#propiedades"
            />
            <QuickAction
              number="01"
              label="Comprar una propiedad"
              href="/comprar"
            />
            <QuickAction
              number="02"
              label="Encontrar un arriendo"
              href="/arrendar"
            />
            <QuickAction
              number="03"
              label="Vender o arrendar mi propiedad"
              href="/contacto"
            />
          </div>
        </div>
      </section>

      <section className="bg-white pt-28">
        <div className="mx-auto max-w-[1180px] px-5 pb-20 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <Eyebrow>Una forma diferente de hacerlo</Eyebrow>
              <h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight tracking-tight text-[#0016A2] sm:text-5xl">
                Propiedades que encajan contigo, no al revés.
              </h2>
            </div>

            <p className="max-w-xl text-base leading-8 text-slate-500">
              Seleccionamos oportunidades para que puedas tomar decisiones con
              mayor claridad y contar con acompañamiento durante cada paso del
              proceso.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <TrustCard
              icon={<ShieldCheck />}
              title="Confianza"
              text="Información clara y acompañamiento cercano."
            />
            <TrustCard
              icon={<BadgeCheck />}
              title="Profesionalismo"
              text="Una experiencia ordenada desde el primer contacto."
            />
            <TrustCard
              icon={<Handshake />}
              title="Acompañamiento"
              text="Estamos contigo antes, durante y después de la operación."
            />
          </div>
        </div>
      </section>

      {featuredProperties.length > 0 && (
        <section className="bg-[#F3F7FC]">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Eyebrow>Selección Valhalla</Eyebrow>
                <h2 className="mt-3 text-4xl font-black tracking-tight text-[#0016A2] sm:text-5xl">
                  Propiedades destacadas
                </h2>
                <p className="mt-4 max-w-2xl leading-7 text-slate-500">
                  Conoce algunas de las propiedades que actualmente aparecen
                  como destacadas en nuestro catálogo.
                </p>
              </div>

              <Link
                href="/propiedades"
                className="inline-flex w-fit items-center gap-2 text-sm font-extrabold text-[#0016A2] transition hover:text-[#79C2EF]"
              >
                Ver todo el catálogo <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        id="propiedades"
        className="scroll-mt-24 bg-[#F3F7FC]"
      >
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow>Portafolio</Eyebrow>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-[#0016A2] sm:text-5xl">
                Encuentra tu próxima propiedad
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-500">
                Explora nuestro catálogo y utiliza los filtros para encontrar
                exactamente lo que estás buscando.
              </p>
            </div>

            <div className="inline-flex w-fit items-center rounded-full border border-[#79C2EF]/50 bg-white px-5 py-2.5 text-xs font-extrabold text-[#0016A2] shadow-sm">
              {propertyList.length}{" "}
              {propertyList.length === 1
                ? "propiedad disponible"
                : "propiedades disponibles"}
            </div>
          </div>

          <PropertyCatalog properties={propertyList} />
        </div>
      </section>

      <section id="servicios" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-2xl">
            <Eyebrow>Nuestros servicios</Eyebrow>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#0016A2] sm:text-5xl">
              Todo el proceso, en buenas manos.
            </h2>
            <p className="mt-5 leading-7 text-slate-500">
              Una experiencia pensada para acompañarte tanto si estás buscando
              una propiedad como si quieres poner la tuya en el mercado.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <ServiceCard
              number="01"
              icon={<Building2 />}
              title="Compra"
              text="Encuentra oportunidades que se ajusten a tu presupuesto, necesidades y estilo de vida."
              href="/comprar"
              action="Explorar propiedades"
            />
            <ServiceCard
              number="02"
              icon={<KeyRound />}
              title="Arriendo"
              text="Descubre espacios para vivir o trabajar con una búsqueda más clara y acompañada."
              href="/arrendar"
              action="Ver opciones"
              featured
            />
            <ServiceCard
              number="03"
              icon={<Handshake />}
              title="Venta"
              text="Presentamos y promocionamos tu inmueble para ayudarte a encontrar el comprador adecuado."
              href="/contacto"
              action="Quiero vender"
            />
          </div>
        </div>
      </section>

      <section id="nosotros" className="scroll-mt-24 bg-[#0016A2]">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-10 lg:py-28">
          <div className="relative">
            <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[#79C2EF]/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/8 p-8 backdrop-blur sm:p-10">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#79C2EF]">
                Valhalla
              </p>
              <p className="mt-4 text-4xl font-black leading-tight text-white">
                Una inmobiliaria cercana, clara y profesional.
              </p>
              <div className="mt-8 h-px bg-white/15" />
              <p className="mt-7 text-sm leading-7 text-white/70">
                Nuestro objetivo es facilitar el proceso inmobiliario y
                ayudarte a avanzar con confianza en cada decisión.
              </p>
            </div>
          </div>

          <div>
            <Eyebrow light>Sobre nosotros</Eyebrow>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              Más que una propiedad, buscamos el lugar correcto para ti.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
              En Valhalla Inmobiliaria queremos que comprar, vender o arrendar
              sea un proceso entendible, acompañado y profesional. Escuchamos
              lo que necesitas y buscamos soluciones que tengan sentido para
              ti.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Atención personalizada",
                "Información clara",
                "Acompañamiento cercano",
                "Proceso profesional",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-semibold text-white/85"
                >
                  <CheckCircle2 size={17} className="text-[#79C2EF]" />
                  {item}
                </div>
              ))}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex items-center gap-2 rounded-xl bg-[#79C2EF] px-6 py-3.5 text-sm font-extrabold text-[#0016A2] transition hover:bg-white"
            >
              Hablar con Valhalla <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <section id="contacto" className="scroll-mt-24 bg-[#F3F7FC]">
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white px-7 py-12 shadow-[0_25px_70px_rgba(0,22,162,0.08)] sm:px-12 lg:px-16 lg:py-16">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#79C2EF]/20 blur-2xl" />
            <div className="relative flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <Eyebrow>¿Tienes una propiedad?</Eyebrow>
                <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#0016A2] sm:text-5xl">
                  Hagamos que encuentre a su próximo dueño o inquilino.
                </h2>
                <p className="mt-5 leading-7 text-slate-500">
                  Cuéntanos sobre tu inmueble y conversemos sobre la mejor forma
                  de presentarlo.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={buildWhatsAppUrl(
                    "Hola, Valhalla Inmobiliaria. Tengo una propiedad y quiero información para venderla o arrendarla."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0016A2] px-6 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#79C2EF] hover:text-[#0016A2]"
                >
                  <MessageCircle size={18} />
                  Escribir por WhatsApp
                </a>

                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0016A2]/15 bg-white px-6 py-4 text-sm font-extrabold text-[#0016A2] transition hover:border-[#79C2EF] hover:bg-[#79C2EF]/10"
                >
                  Contactarnos <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_35px_rgba(37,211,102,0.35)] transition hover:scale-105 sm:bottom-6 sm:right-6"
      >
        <MessageCircle size={25} />
      </a>
    </main>
  );
}

function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={`text-xs font-extrabold uppercase tracking-[0.22em] ${
        light ? "text-[#79C2EF]" : "text-[#0016A2]"
      }`}
    >
      {children}
    </p>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="pr-4">
      <p className="text-2xl font-black text-[#0016A2]">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{label}</p>
    </div>
  );
}

function QuickAction({
  number,
  label,
  href,
}: {
  number: string;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-transparent px-4 py-3 transition hover:border-[#79C2EF]/60 hover:bg-[#F3F7FC]"
    >
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#79C2EF]">
        {number}
      </p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold text-[#0016A2]">{label}</p>
        <ArrowRight
          size={16}
          className="shrink-0 text-[#79C2EF] transition group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

function TrustCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#F3F7FC] p-6 transition hover:-translate-y-1 hover:border-[#79C2EF]/60 hover:bg-white hover:shadow-xl hover:shadow-[#0016A2]/5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#79C2EF]/25 text-[#0016A2]">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-extrabold text-[#0016A2]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

function ServiceCard({
  number,
  icon,
  title,
  text,
  href,
  action,
  featured = false,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
  href: string;
  action: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[1.75rem] border p-8 transition duration-500 hover:-translate-y-1 ${
        featured
          ? "border-[#0016A2] bg-[#0016A2] text-white shadow-xl shadow-[#0016A2]/15"
          : "border-slate-200 bg-[#F3F7FC] text-slate-800 hover:border-[#79C2EF]/70 hover:bg-white hover:shadow-xl"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            featured
              ? "bg-white/10 text-[#79C2EF]"
              : "bg-[#79C2EF]/25 text-[#0016A2]"
          }`}
        >
          {icon}
        </div>
        <span
          className={`text-xs font-black tracking-[0.2em] ${
            featured ? "text-white/35" : "text-slate-300"
          }`}
        >
          {number}
        </span>
      </div>

      <h3
        className={`mt-8 text-2xl font-black ${
          featured ? "text-white" : "text-[#0016A2]"
        }`}
      >
        {title}
      </h3>

      <p
        className={`mt-3 min-h-[84px] text-sm leading-7 ${
          featured ? "text-white/70" : "text-slate-500"
        }`}
      >
        {text}
      </p>

      <Link
        href={href}
        className={`mt-7 inline-flex items-center gap-2 text-sm font-extrabold ${
          featured ? "text-[#79C2EF]" : "text-[#0016A2]"
        }`}
      >
        {action} <ArrowRight size={16} />
      </Link>
    </article>
  );
}
