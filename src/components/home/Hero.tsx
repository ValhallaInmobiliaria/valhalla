import SearchBar from "./SearchBar";
export default function Hero() {
    return (
        <section
            className="relative h-screen bg-cover bg-center"
            style={{
                backgroundImage: `
          linear-gradient(
            rgba(37,88,134,.75),
            rgba(186,168,210,.55)
          ),
          url('/images/hero.jpg')
        `,
            }}
        >
            <div className="max-w-7xl mx-auto h-full flex items-center px-6">
                <div className="max-w-3xl text-white">
                    <span className="inline-block bg-blue-500 px-4 py-2 rounded-full text-sm font-semibold">
                        Valhalla Inmobiliaria
                    </span>

                    <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-tight">
                        Encuentra el inmueble ideal para ti
                    </h1>

                    <p className="mt-6 text-xl text-white/90">
                        Compra, vende y arrienda propiedades con la confianza de un equipo
                        profesional.
                    </p>

                    <div className="mt-10 flex gap-4">
                        <a
                            href="/comprar"
                            className="rounded-xl bg-[#0016A2] px-8 py-4 font-semibold text-white hover:opacity-90 transition"
                        >
                            Comprar
                        </a>

                        <a
                            href="/arrendar"
                            className="rounded-xl border border-white px-8 py-4 font-semibold text-white hover:bg-white hover:text-[#0016A2] transition"
                        >
                            Arrendar
                        </a>
                    </div>
                </div>
            </div>
            <SearchBar />
        </section>
    );
}