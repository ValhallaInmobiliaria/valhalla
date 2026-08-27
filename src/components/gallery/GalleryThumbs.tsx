"use client";

import Image from "next/image";
import { useRef } from "react";

import { GalleryImage } from "./GalleryTypes";

interface GalleryThumbsProps {
    photos: GalleryImage[];
    current: number;
    onSelect: (index: number) => void;
}

export default function GalleryThumbs({
    photos,
    current,
    onSelect,
}: GalleryThumbsProps) {

    const containerRef =
        useRef<HTMLDivElement>(null);

    function scrollLeft() {

        containerRef.current?.scrollBy({
            left: -500,
            behavior: "smooth",
        });

    }

    function scrollRight() {

        containerRef.current?.scrollBy({
            left: 500,
            behavior: "smooth",
        });

    }

    function selectPhoto(index: number) {

        onSelect(index);

        const container =
            containerRef.current;

        const element =
            container?.children[index] as HTMLElement;

        element?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });

    }

    return (

        <div className="relative w-full">

            {/* ======================================
                FLECHA IZQUIERDA
            ====================================== */}

            {photos.length > 5 && (

                <button
                    type="button"
                    aria-label="Ver fotografías anteriores"
                    onClick={scrollLeft}
                    className="
                        absolute
                        left-0
                        top-1/2
                        -translate-y-1/2
                        z-20

                        w-10
                        h-10

                        rounded-full

                        bg-white
                        shadow-lg

                        flex
                        items-center
                        justify-center

                        text-[#0016A2]
                        text-xl
                        font-bold

                        hover:bg-[#79C2EF]
                        hover:text-white

                        transition-all

                        -translate-x-1/2
                    "
                >
                    ❮
                </button>

            )}

            {/* ======================================
                CONTENEDOR MINIATURAS
            ====================================== */}

            <div
                ref={containerRef}
                className="
                    flex
                    gap-3

                    overflow-x-auto
                    overflow-y-hidden

                    pb-3

                    scroll-smooth

                    snap-x
                    snap-mandatory

                    scrollbar-thin
                    scrollbar-thumb-[#0016A2]
                    scrollbar-track-gray-100

                    touch-pan-x
                "
            >

                {photos.map((photo, index) => (

                    <button
                        key={photo.id}
                        type="button"
                        onClick={() =>
                            selectPhoto(index)
                        }
                        aria-label={`Ver imagen ${index + 1}`}
                        className="
                            relative

                            flex-shrink-0

                            w-28
                            h-20

                            sm:w-32
                            sm:h-24

                            rounded-xl

                            overflow-hidden

                            snap-center

                            focus:outline-none

                            transition-all
                            duration-300
                        "
                    >

                        <Image
                            src={photo.url}
                            alt={`Miniatura ${index + 1}`}
                            fill
                            sizes="128px"
                            draggable={false}
                            className={`
                                object-cover

                                transition-transform
                                duration-300

                                ${current === index
                                    ? "scale-95"
                                    : "hover:scale-105"
                                }
                            `}
                        />

                        {/* ==================================
                            BORDE SELECCIONADO
                        ================================== */}

                        <div
                            className={`
                                absolute
                                inset-0

                                rounded-xl

                                border-4

                                pointer-events-none

                                ${current === index
                                    ? "border-[#79C2EF]"
                                    : "border-transparent"
                                }
                            `}
                        />

                        {/* ==================================
                            NUMERO
                        ================================== */}

                        <span
                            className="
                                absolute
                                bottom-1
                                right-1

                                min-w-6
                                h-6

                                px-1

                                rounded-full

                                bg-black/70

                                text-white
                                text-xs

                                flex
                                items-center
                                justify-center
                            "
                        >

                            {index + 1}

                        </span>

                    </button>

                ))}

            </div>

            {/* ======================================
                FLECHA DERECHA
            ====================================== */}

            {photos.length > 5 && (

                <button
                    type="button"
                    aria-label="Ver siguientes fotografías"
                    onClick={scrollRight}
                    className="
                        absolute
                        right-0
                        top-1/2
                        -translate-y-1/2
                        z-20

                        w-10
                        h-10

                        rounded-full

                        bg-white
                        shadow-lg

                        flex
                        items-center
                        justify-center

                        text-[#0016A2]
                        text-xl
                        font-bold

                        hover:bg-[#79C2EF]
                        hover:text-white

                        transition-all

                        translate-x-1/2
                    "
                >
                    ❯
                </button>

            )}

            {/* ======================================
                INDICADOR
            ====================================== */}

            {photos.length > 5 && (

                <p
                    className="
                        mt-1

                        text-xs
                        text-gray-400

                        text-center
                    "
                >
                    Desliza las miniaturas para ver más
                </p>

            )}

        </div>

    );

}