"use client";

import { useState } from "react";
import Image from "next/image";

import GalleryViewer from "./GalleryViewer";
import GalleryThumbs from "./GalleryThumbs";
import { GalleryImage } from "./GalleryTypes";
import { isImageUrl } from "@/lib/media";

interface PhotoGalleryProps {
    images: GalleryImage[];
}

export default function PhotoGallery({
    images,
}: PhotoGalleryProps) {

    const safeImages = (images ?? []).filter((image) => isImageUrl(image.url));
    const [current, setCurrent] = useState(0);

    const [open, setOpen] = useState(false);

    if (safeImages.length === 0) {

        return (
            <div
                className="
                    h-[550px]
                    rounded-3xl
                    bg-gray-200
                    flex
                    items-center
                    justify-center
                    text-gray-500
                "
            >
                Sin imágenes
            </div>
        );

    }

    const active = safeImages[Math.min(current, safeImages.length - 1)];

    function previous() {

        setCurrent((previousIndex) =>
            previousIndex === 0
                ? safeImages.length - 1
                : previousIndex - 1
        );

    }

    function next() {

        setCurrent((previousIndex) =>
            previousIndex === safeImages.length - 1
                ? 0
                : previousIndex + 1
        );

    }

    function openViewer() {

        setOpen(true);

    }

    function closeViewer() {

        setOpen(false);

    }

    return (

        <div className="w-full space-y-5">

            {/* =========================================
                IMAGEN PRINCIPAL
            ========================================= */}

            <div
                className="
                    relative
                    w-full
                    h-[550px]
                    sm:h-[600px]
                    rounded-3xl
                    overflow-hidden
                    bg-gray-100
                    shadow-2xl
                    cursor-zoom-in
                    group
                "
                onClick={openViewer}
            >

                <Image
                    src={active.url}
                    alt={`Imagen ${current + 1}`}
                    fill
                    priority
                    loading="eager"
                    sizes="
                        (max-width: 640px) 100vw,
                        (max-width: 1024px) 90vw,
                        1200px
                    "
                    className="
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-[1.02]
                    "
                />

                {/* Capa oscura inferior */}

                <div
                    className="
                        absolute
                        inset-x-0
                        bottom-0
                        h-32
                        bg-gradient-to-t
                        from-black/50
                        to-transparent
                        pointer-events-none
                    "
                />

                {/* =====================================
                    FLECHA ANTERIOR
                ===================================== */}

                {safeImages.length > 1 && (

                    <button
                        type="button"
                        aria-label="Imagen anterior"
                        onClick={(event) => {

                            event.stopPropagation();

                            previous();

                        }}
                        className="
                            absolute
                            left-4
                            sm:left-6
                            top-1/2
                            -translate-y-1/2
                            w-11
                            h-11
                            sm:w-12
                            sm:h-12
                            rounded-full
                            bg-white/90
                            backdrop-blur
                            shadow-xl
                            flex
                            items-center
                            justify-center
                            text-[#0016A2]
                            text-2xl
                            font-bold
                            hover:bg-[#79C2EF]
                            hover:text-white
                            hover:scale-110
                            transition-all
                            duration-200
                            z-10
                        "
                    >
                        ❮
                    </button>

                )}

                {/* =====================================
                    FLECHA SIGUIENTE
                ===================================== */}

                {safeImages.length > 1 && (

                    <button
                        type="button"
                        aria-label="Imagen siguiente"
                        onClick={(event) => {

                            event.stopPropagation();

                            next();

                        }}
                        className="
                            absolute
                            right-4
                            sm:right-6
                            top-1/2
                            -translate-y-1/2
                            w-11
                            h-11
                            sm:w-12
                            sm:h-12
                            rounded-full
                            bg-white/90
                            backdrop-blur
                            shadow-xl
                            flex
                            items-center
                            justify-center
                            text-[#0016A2]
                            text-2xl
                            font-bold
                            hover:bg-[#79C2EF]
                            hover:text-white
                            hover:scale-110
                            transition-all
                            duration-200
                            z-10
                        "
                    >
                        ❯
                    </button>

                )}

                {/* =====================================
                    CONTADOR
                ===================================== */}

                <div
                    className="
                        absolute
                        bottom-5
                        right-5
                        z-10
                        bg-black/65
                        backdrop-blur-md
                        text-white
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-medium
                    "
                >

                    {current + 1} / {safeImages.length}

                </div>

                {/* =====================================
                    INDICADOR DE ZOOM
                ===================================== */}

                <div
                    className="
                        absolute
                        bottom-5
                        left-5
                        z-10
                        bg-black/60
                        backdrop-blur-md
                        text-white
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity
                    "
                >

                    🔍 Haz clic para ampliar

                </div>

            </div>

            {/* =========================================
                MINIATURAS
            ========================================= */}

            <GalleryThumbs
                photos={safeImages}
                current={current}
                onSelect={(index) => {

                    setCurrent(index);

                }}
            />

            {/* =========================================
                INFORMACIÓN
            ========================================= */}

            <div
                className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-3
                "
            >

                <div>

                    <p
                        className="
                            text-gray-500
                            text-sm
                        "
                    >
                        {safeImages.length} fotografías disponibles
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => {

                        setCurrent(0);

                    }}
                    className="
                        self-start
                        sm:self-auto
                        px-5
                        py-2
                        rounded-full
                        bg-[#0016A2]
                        text-white
                        text-sm
                        font-medium
                        hover:bg-[#79C2EF]
                        transition
                    "
                >

                    Ver primera imagen

                </button>

            </div>

            {/* =========================================
                VISOR PROFESIONAL
            ========================================= */}

            <GalleryViewer

                photos={safeImages}

                current={current}

                open={open}

                onClose={closeViewer}

                onPrevious={previous}

                onNext={next}

            />

        </div>

    );

}