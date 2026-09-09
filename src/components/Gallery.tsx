"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { isImageUrl } from "@/lib/media";

interface GalleryImage {
    id: string;
    url: string;
}

interface GalleryProps {
    principal?: string;
    images?: GalleryImage[];
}

export default function Gallery({
    principal,
    images = [],
}: GalleryProps) {
    const photos: GalleryImage[] = [
        ...(principal
            ? [
                {
                    id: "principal",
                    url: principal,
                },
            ]
            : []),
        ...images,
    ].filter((image) => isImageUrl(image.url));

    const [current, setCurrent] = useState(0);
    const [direction, setDirection] =
        useState<"left" | "right">("right");

    const [open, setOpen] = useState(false);
    const [zoom, setZoom] = useState(1);

    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });

    const [dragging, setDragging] = useState(false);

    const [start, setStart] = useState({
        x: 0,
        y: 0,
    });

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const zoomContainerRef =
        useRef<HTMLDivElement>(null);

    /*
    ==========================================
    SI NO HAY IMÁGENES
    ==========================================
    */

    if (photos.length === 0) {
        return (
            <div className="h-[600px] rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-3">
                        🖼️
                    </div>

                    <p className="text-slate-500 font-medium">
                        Sin imágenes disponibles
                    </p>
                </div>
            </div>
        );
    }

    const active = photos[current];

    /*
    ==========================================
    RESET
    ==========================================
    */

    function resetZoom() {
        setZoom(1);

        setPosition({
            x: 0,
            y: 0,
        });

        setDragging(false);
    }

    /*
    ==========================================
    SIGUIENTE
    ==========================================
    */

    function next() {
        if (photos.length <= 1) return;

        setDirection("right");

        setCurrent((prev) =>
            prev === photos.length - 1
                ? 0
                : prev + 1
        );

        resetZoom();
    }

    /*
    ==========================================
    ANTERIOR
    ==========================================
    */

    function previous() {
        if (photos.length <= 1) return;

        setDirection("left");

        setCurrent((prev) =>
            prev === 0
                ? photos.length - 1
                : prev - 1
        );

        resetZoom();
    }

    /*
    ==========================================
    ZOOM +
    ==========================================
    */

    function zoomIn() {
        setZoom((prev) =>
            Math.min(
                Number(
                    (prev + 0.25).toFixed(2)
                ),
                4
            )
        );
    }

    /*
    ==========================================
    ZOOM -
    ==========================================
    */

    function zoomOut() {
        setZoom((prev) => {
            const newZoom = Math.max(
                Number(
                    (prev - 0.25).toFixed(2)
                ),
                1
            );

            if (newZoom === 1) {
                setPosition({
                    x: 0,
                    y: 0,
                });
            }

            return newZoom;
        });
    }

    /*
    ==========================================
    TOUCH / SWIPE
    ==========================================
    */

    function handleTouchStart(
        e: React.TouchEvent<HTMLDivElement>
    ) {
        touchStartX.current =
            e.touches[0].clientX;

        touchEndX.current =
            e.touches[0].clientX;
    }

    function handleTouchMove(
        e: React.TouchEvent<HTMLDivElement>
    ) {
        touchEndX.current =
            e.touches[0].clientX;
    }

    function handleTouchEnd() {
        const distance =
            touchStartX.current -
            touchEndX.current;

        const minimumSwipe = 50;

        if (
            Math.abs(distance) <
            minimumSwipe
        ) {
            return;
        }

        if (distance > 0) {
            next();
        } else {
            previous();
        }

        touchStartX.current = 0;
        touchEndX.current = 0;
    }

    /*
    ==========================================
    TECLADO
    ==========================================
    */

    useEffect(() => {
        function handleKey(
            e: KeyboardEvent
        ) {
            if (!open) return;

            switch (e.key) {
                case "Escape":
                    setOpen(false);
                    resetZoom();
                    break;

                case "ArrowRight":
                    next();
                    break;

                case "ArrowLeft":
                    previous();
                    break;

                case "+":
                case "=":
                    zoomIn();
                    break;

                case "-":
                    zoomOut();
                    break;

                case "0":
                    resetZoom();
                    break;
            }
        }

        window.addEventListener(
            "keydown",
            handleKey
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKey
            );
        };
    }, [open, photos.length]);

    /*
    ==========================================
    BLOQUEAR SCROLL DEL BODY EN MODAL
    ==========================================
    */

    useEffect(() => {
        if (!open) return;

        const originalOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        return () => {
            document.body.style.overflow =
                originalOverflow;
        };
    }, [open]);

    /*
    ==========================================
    RUEDA DEL MOUSE
    ==========================================
    */

    useEffect(() => {
        if (!open) return;

        function handleWheel(e: WheelEvent) {
            const container =
                zoomContainerRef.current;

            if (!container) return;

            if (
                !container.contains(
                    e.target as Node
                )
            ) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            const amount = 0.25;

            if (e.deltaY < 0) {
                setZoom((prev) =>
                    Math.min(
                        Number(
                            (
                                prev + amount
                            ).toFixed(2)
                        ),
                        4
                    )
                );
            }

            if (e.deltaY > 0) {
                setZoom((prev) => {
                    const newZoom =
                        Math.max(
                            Number(
                                (
                                    prev - amount
                                ).toFixed(2)
                            ),
                            1
                        );

                    if (newZoom === 1) {
                        setPosition({
                            x: 0,
                            y: 0,
                        });
                    }

                    return newZoom;
                });
            }
        }

        document.addEventListener(
            "wheel",
            handleWheel,
            {
                passive: false,
                capture: true,
            }
        );

        return () => {
            document.removeEventListener(
                "wheel",
                handleWheel,
                true
            );
        };
    }, [open]);

    /*
    ==========================================
    RENDER
    ==========================================
    */

    return (
        <div className="w-full space-y-5">

            {/* =================================
                GALERÍA PRINCIPAL
            ================================= */}

            <div className="relative group">

                <div
                    className="
                        relative
                        w-full
                        h-[600px]
                        sm:h-[600px]
                        rounded-3xl
                        overflow-hidden
                        bg-slate-100
                        shadow-[0_20px_60px_rgba(15,23,42,0.14)]
                        border
                        border-slate-200
                        cursor-zoom-in
                    "
                    onTouchStart={
                        handleTouchStart
                    }
                    onTouchMove={
                        handleTouchMove
                    }
                    onTouchEnd={
                        handleTouchEnd
                    }
                    onClick={() =>
                        setOpen(true)
                    }
                >
                    <Image
                        src={active.url}
                        alt={`Imagen de la propiedad ${current + 1
                            }`}
                        fill
                        priority
                        loading="eager"
                        sizes="100vw"
                        className={`
                            object-cover
                            transition-all
                            duration-500
                            ease-out
                            ${direction === "right"
                                ? "animate-gallery-right"
                                : "animate-gallery-left"
                            }
                            group-hover:scale-[1.015]
                        `}
                    />

                    {/* Degradado inferior */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-x-0
                            bottom-0
                            h-32
                            bg-gradient-to-t
                            from-black/45
                            to-transparent
                        "
                    />

                    {/* Indicador superior */}

                    <div
                        className="
                            absolute
                            left-5
                            top-5
                            flex
                            items-center
                            gap-2
                            rounded-full
                            bg-black/45
                            backdrop-blur-md
                            border
                            border-white/20
                            px-4
                            py-2
                            text-xs
                            font-medium
                            text-white
                        "
                    >
                        <span
                            className="
                                h-2
                                w-2
                                rounded-full
                                bg-white
                            "
                        />

                        Galería
                    </div>

                    {/* Contador */}

                    <div
                        className="
                            absolute
                            bottom-5
                            right-5
                            rounded-full
                            bg-black/65
                            backdrop-blur-md
                            border
                            border-white/20
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-white
                            shadow-lg
                        "
                    >
                        {current + 1} /{" "}
                        {photos.length}
                    </div>

                    {/* Texto inferior */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            bottom-5
                            left-5
                            hidden
                            sm:block
                            text-white
                            text-sm
                            font-medium
                            drop-shadow-lg
                        "
                    >
                        Haz clic para ampliar
                    </div>
                </div>

                {/* =================================
                    FLECHA ANTERIOR
                ================================= */}

                {photos.length > 1 && (
                    <button
                        type="button"
                        aria-label="Imagen anterior"
                        title="Imagen anterior"
                        onClick={(e) => {
                            e.stopPropagation();
                            previous();
                        }}
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            z-20
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-white/90
                            backdrop-blur-md
                            text-xl
                            font-bold
                            text-[#0016A2]
                            shadow-xl
                            ring-1
                            ring-black/5
                            transition
                            duration-200
                            hover:bg-[#79C2EF]
                            hover:text-white
                            hover:scale-105
                            active:scale-95
                        "
                    >
                        ❮
                    </button>
                )}

                {/* =================================
                    FLECHA SIGUIENTE
                ================================= */}

                {photos.length > 1 && (
                    <button
                        type="button"
                        aria-label="Imagen siguiente"
                        title="Imagen siguiente"
                        onClick={(e) => {
                            e.stopPropagation();
                            next();
                        }}
                        className="
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            z-20
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-white/90
                            backdrop-blur-md
                            text-xl
                            font-bold
                            text-[#0016A2]
                            shadow-xl
                            ring-1
                            ring-black/5
                            transition
                            duration-200
                            hover:bg-[#79C2EF]
                            hover:text-white
                            hover:scale-105
                            active:scale-95
                        "
                    >
                        ❯
                    </button>
                )}
            </div>

            {/* =================================
                MINIATURAS
            ================================= */}

            <div className="relative">

                <div
                    className="
                        flex
                        gap-3
                        overflow-x-auto
                        pb-2
                        scrollbar-thin
                        scrollbar-thumb-slate-300
                        scrollbar-track-transparent
                    "
                >
                    {photos.map(
                        (photo, index) => (
                            <button
                                key={photo.id}
                                type="button"
                                aria-label={`Ver imagen ${index + 1
                                    }`}
                                aria-current={
                                    current ===
                                    index
                                }
                                onClick={() => {
                                    setCurrent(
                                        index
                                    );
                                    resetZoom();
                                }}
                                className={`
                                    relative
                                    flex-shrink-0
                                    h-20
                                    w-28
                                    overflow-hidden
                                    rounded-xl
                                    border-2
                                    transition-all
                                    duration-200
                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-[#79C2EF]
                                    focus-visible:ring-offset-2
                                    ${current ===
                                        index
                                        ? "border-[#79C2EF] shadow-lg scale-[0.97]"
                                        : "border-transparent opacity-70 hover:opacity-100 hover:scale-[0.98]"
                                    }
                                `}
                            >
                                <Image
                                    src={photo.url}
                                    alt={`Miniatura ${index + 1
                                        }`}
                                    fill
                                    loading="lazy"
                                    sizes="112px"
                                    className="object-cover"
                                />

                                {current ===
                                    index && (
                                        <div
                                            className="
                                            absolute
                                            inset-0
                                            bg-[#79C2EF]/10
                                        "
                                        />
                                    )}
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* =================================
                PIE DE GALERÍA
            ================================= */}

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div>
                    <p className="text-sm font-medium text-slate-700">
                        {photos.length}{" "}
                        {photos.length === 1
                            ? "fotografía"
                            : "fotografías"}{" "}
                        disponibles
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                        Usa las flechas o selecciona
                        una miniatura para navegar
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setCurrent(0);
                        resetZoom();
                    }}
                    className="
                        self-start
                        sm:self-auto
                        rounded-full
                        border
                        border-[#0016A2]
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-[#0016A2]
                        transition
                        duration-200
                        hover:bg-[#0016A2]
                        hover:text-white
                        active:scale-95
                    "
                >
                    Ver primera imagen
                </button>
            </div>

            {/* =================================
                MODAL / LIGHTBOX
            ================================= */}

            {open && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[9999]
                        flex
                        items-center
                        justify-center
                        bg-black/[0.96]
                        backdrop-blur-md
                        select-none
                    "
                    role="dialog"
                    aria-modal="true"
                    aria-label="Galería de imágenes"
                    onClick={() => {
                        setOpen(false);
                        resetZoom();
                    }}
                >
                    {/* =================================
                        BOTÓN CERRAR
                    ================================= */}

                    <button
                        type="button"
                        aria-label="Cerrar galería"
                        title="Cerrar"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(false);
                            resetZoom();
                        }}
                        className="
                            absolute
                            right-5
                            top-5
                            z-[100]
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-white/10
                            backdrop-blur-md
                            border
                            border-white/15
                            text-3xl
                            text-white
                            transition
                            hover:bg-[#79C2EF]
                            active:scale-95
                        "
                    >
                        ×
                    </button>

                    {/* =================================
                        CONTADOR SUPERIOR
                    ================================= */}

                    <div
                        className="
                            absolute
                            left-1/2
                            top-5
                            z-[100]
                            -translate-x-1/2
                            rounded-full
                            bg-white/10
                            backdrop-blur-md
                            border
                            border-white/15
                            px-5
                            py-2
                            text-sm
                            font-medium
                            text-white
                        "
                    >
                        {current + 1} /{" "}
                        {photos.length}
                    </div>

                    {/* =================================
                        CONTROLES DE ZOOM
                    ================================= */}

                    <div
                        className="
                            absolute
                            bottom-5
                            left-5
                            z-[100]
                            flex
                            items-center
                            gap-2
                            rounded-full
                            bg-black/60
                            backdrop-blur-md
                            border
                            border-white/10
                            p-1.5
                        "
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        <button
                            type="button"
                            aria-label="Alejar"
                            title="Alejar"
                            disabled={zoom <= 1}
                            onClick={() =>
                                zoomOut()
                            }
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                text-2xl
                                text-white
                                transition
                                hover:bg-white/10
                                disabled:cursor-not-allowed
                                disabled:opacity-30
                            "
                        >
                            −
                        </button>

                        <div
                            className="
                                min-w-[58px]
                                text-center
                                text-xs
                                font-semibold
                                text-white
                            "
                        >
                            {Math.round(
                                zoom * 100
                            )}
                            %
                        </div>

                        <button
                            type="button"
                            aria-label="Acercar"
                            title="Acercar"
                            disabled={zoom >= 4}
                            onClick={() =>
                                zoomIn()
                            }
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                text-2xl
                                text-white
                                transition
                                hover:bg-white/10
                                disabled:cursor-not-allowed
                                disabled:opacity-30
                            "
                        >
                            +
                        </button>

                        <button
                            type="button"
                            aria-label="Restablecer zoom"
                            title="Restablecer zoom"
                            onClick={() =>
                                resetZoom()
                            }
                            className="
                                ml-1
                                rounded-full
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-white/70
                                transition
                                hover:bg-white/10
                                hover:text-white
                            "
                        >
                            Restablecer
                        </button>
                    </div>

                    {/* =================================
                        AYUDA
                    ================================= */}

                    <div
                        className="
                            absolute
                            bottom-6
                            right-6
                            z-[100]
                            hidden
                            lg:block
                            rounded-full
                            bg-black/50
                            backdrop-blur-md
                            px-4
                            py-2
                            text-xs
                            text-white/60
                        "
                    >
                        ← → navegar · Esc cerrar ·
                        doble clic ampliar
                    </div>

                    {/* =================================
                        FLECHA IZQUIERDA MODAL
                    ================================= */}

                    {photos.length > 1 && (
                        <button
                            type="button"
                            aria-label="Imagen anterior"
                            title="Imagen anterior"
                            onClick={(e) => {
                                e.stopPropagation();
                                previous();
                            }}
                            className="
                                absolute
                                left-4
                                sm:left-6
                                top-1/2
                                z-[100]
                                -translate-y-1/2
                                flex
                                h-12
                                w-12
                                sm:h-14
                                sm:w-14
                                items-center
                                justify-center
                                rounded-full
                                bg-white/90
                                text-xl
                                sm:text-2xl
                                font-bold
                                text-[#0016A2]
                                shadow-xl
                                transition
                                hover:bg-[#79C2EF]
                                hover:text-white
                                hover:scale-105
                                active:scale-95
                            "
                        >
                            ❮
                        </button>
                    )}

                    {/* =================================
                        CONTENEDOR DE IMAGEN
                    ================================= */}

                    <div
                        ref={
                            zoomContainerRef
                        }
                        className={`
                            relative
                            h-[78vh]
                            w-[88vw]
                            sm:h-[82vh]
                            sm:w-[88vw]
                            overflow-hidden
                            flex
                            items-center
                            justify-center
                            ${zoom > 1
                                ? dragging
                                    ? "cursor-grabbing"
                                    : "cursor-grab"
                                : "cursor-zoom-in"
                            }
                        `}
                        style={{
                            touchAction: "none",
                            overscrollBehavior:
                                "contain",
                        }}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                        onPointerDown={(e) => {
                            e.stopPropagation();

                            if (zoom <= 1)
                                return;

                            e.preventDefault();

                            e.currentTarget.setPointerCapture(
                                e.pointerId
                            );

                            setDragging(true);

                            setStart({
                                x:
                                    e.clientX -
                                    position.x,
                                y:
                                    e.clientY -
                                    position.y,
                            });
                        }}
                        onPointerMove={(e) => {
                            if (!dragging)
                                return;

                            if (zoom <= 1)
                                return;

                            e.preventDefault();

                            setPosition({
                                x:
                                    e.clientX -
                                    start.x,
                                y:
                                    e.clientY -
                                    start.y,
                            });
                        }}
                        onPointerUp={(e) => {
                            if (
                                e.currentTarget.hasPointerCapture(
                                    e.pointerId
                                )
                            ) {
                                e.currentTarget.releasePointerCapture(
                                    e.pointerId
                                );
                            }

                            setDragging(false);
                        }}
                        onPointerCancel={() => {
                            setDragging(false);
                        }}
                        onDoubleClick={(e) => {
                            e.stopPropagation();

                            if (zoom === 1) {
                                setZoom(2);
                            } else {
                                resetZoom();
                            }
                        }}
                    >
                        <Image
                            src={active.url}
                            alt={`Imagen ampliada ${current + 1
                                }`}
                            fill
                            sizes="90vw"
                            loading="eager"
                            draggable={false}
                            className="
                                object-contain
                                pointer-events-none
                            "
                            style={{
                                transform: `
                                    translate(
                                        ${position.x}px,
                                        ${position.y}px
                                    )
                                    scale(${zoom})
                                `,
                                transition:
                                    dragging
                                        ? "none"
                                        : "transform 0.2s ease-out",
                            }}
                        />
                    </div>

                    {/* =================================
                        FLECHA DERECHA MODAL
                    ================================= */}

                    {photos.length > 1 && (
                        <button
                            type="button"
                            aria-label="Imagen siguiente"
                            title="Imagen siguiente"
                            onClick={(e) => {
                                e.stopPropagation();
                                next();
                            }}
                            className="
                                absolute
                                right-4
                                sm:right-6
                                top-1/2
                                z-[100]
                                -translate-y-1/2
                                flex
                                h-12
                                w-12
                                sm:h-14
                                sm:w-14
                                items-center
                                justify-center
                                rounded-full
                                bg-white/90
                                text-xl
                                sm:text-2xl
                                font-bold
                                text-[#0016A2]
                                shadow-xl
                                transition
                                hover:bg-[#79C2EF]
                                hover:text-white
                                hover:scale-105
                                active:scale-95
                            "
                        >
                            ❯
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}