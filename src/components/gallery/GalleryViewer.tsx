"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { GalleryImage } from "./GalleryTypes";

interface GalleryViewerProps {
    photos: GalleryImage[];
    current: number;
    open: boolean;

    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
}

export default function GalleryViewer({
    photos,
    current,
    open,
    onClose,
    onPrevious,
    onNext,
}: GalleryViewerProps) {

    const [zoom, setZoom] = useState(1);

    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });

    const [dragging, setDragging] = useState(false);

    const dragStart = useRef({
        x: 0,
        y: 0,
    });

    const touchStart = useRef({
        x: 0,
        y: 0,
    });

    const image = photos[current];

    /* =========================================
       REINICIAR ZOOM AL CAMBIAR DE IMAGEN
    ========================================= */

    useEffect(() => {

        setZoom(1);

        setPosition({
            x: 0,
            y: 0,
        });

    }, [current]);

    /* =========================================
       TECLADO
    ========================================= */

    useEffect(() => {

        if (!open) return;

        function handleKeyboard(event: KeyboardEvent) {

            if (event.key === "Escape") {

                onClose();

                return;

            }

            if (event.key === "ArrowLeft") {

                event.preventDefault();

                onPrevious();

                return;

            }

            if (event.key === "ArrowRight") {

                event.preventDefault();

                onNext();

                return;

            }

            if (event.key === "+") {

                setZoom((value) =>
                    Math.min(value + 0.25, 4)
                );

                return;

            }

            if (event.key === "-") {

                setZoom((value) => {

                    const next = Math.max(
                        value - 0.25,
                        1
                    );

                    if (next === 1) {

                        setPosition({
                            x: 0,
                            y: 0,
                        });

                    }

                    return next;

                });

            }

        }

        window.addEventListener(
            "keydown",
            handleKeyboard
        );

        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyboard
            );

        };

    }, [
        open,
        onClose,
        onPrevious,
        onNext,
    ]);

    if (!open || !image) {

        return null;

    }

    /* =========================================
       ZOOM
    ========================================= */

    function zoomIn(event?: React.MouseEvent) {

        event?.stopPropagation();

        setZoom((value) =>
            Math.min(value + 0.25, 4)
        );

    }

    function zoomOut(event?: React.MouseEvent) {

        event?.stopPropagation();

        setZoom((value) => {

            const next = Math.max(
                value - 0.25,
                1
            );

            if (next === 1) {

                setPosition({
                    x: 0,
                    y: 0,
                });

            }

            return next;

        });

    }

    function resetZoom(
        event?: React.MouseEvent
    ) {

        event?.stopPropagation();

        setZoom(1);

        setPosition({
            x: 0,
            y: 0,
        });

    }

    /* =========================================
       DOBLE CLIC
    ========================================= */

    function handleDoubleClick(
        event: React.MouseEvent
    ) {

        event.stopPropagation();

        if (zoom === 1) {

            setZoom(2);

        } else {

            setZoom(1);

            setPosition({
                x: 0,
                y: 0,
            });

        }

    }

    /* =========================================
       ARRASTRAR IMAGEN
    ========================================= */

    function handleMouseDown(
        event: React.MouseEvent
    ) {

        event.stopPropagation();

        if (zoom <= 1) return;

        setDragging(true);

        dragStart.current = {

            x: event.clientX - position.x,

            y: event.clientY - position.y,

        };

    }

    function handleMouseMove(
        event: React.MouseEvent
    ) {

        if (!dragging) return;

        setPosition({

            x:
                event.clientX -
                dragStart.current.x,

            y:
                event.clientY -
                dragStart.current.y,

        });

    }

    function handleMouseUp() {

        setDragging(false);

    }

    /* =========================================
       SWIPE MÓVIL
    ========================================= */

    function handleTouchStart(
        event: React.TouchEvent
    ) {

        touchStart.current = {

            x: event.touches[0].clientX,

            y: event.touches[0].clientY,

        };

    }

    function handleTouchEnd(
        event: React.TouchEvent
    ) {

        if (zoom > 1) return;

        const endX =
            event.changedTouches[0].clientX;

        const difference =
            endX - touchStart.current.x;

        const minimumSwipe = 60;

        if (difference > minimumSwipe) {

            onPrevious();

        }

        if (difference < -minimumSwipe) {

            onNext();

        }

    }

    /* =========================================
       CERRAR SOLAMENTE AL HACER CLICK
       EN EL FONDO
    ========================================= */

    function handleBackgroundClick(
        event: React.MouseEvent<HTMLDivElement>
    ) {

        if (
            event.target ===
            event.currentTarget
        ) {

            onClose();

        }

    }

    return (

        <div
            className="
                fixed
                inset-0
                z-[9999]
                bg-black/95
                backdrop-blur-sm
                flex
                items-center
                justify-center
            "
            onClick={handleBackgroundClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >

            {/* =====================================
                BOTÓN CERRAR
            ===================================== */}

            <button
                type="button"
                aria-label="Cerrar galería"
                onClick={(event) => {

                    event.stopPropagation();

                    onClose();

                }}
                className="
                    absolute
                    top-5
                    right-5
                    sm:top-7
                    sm:right-8
                    z-50
                    w-12
                    h-12
                    rounded-full
                    bg-white/10
                    hover:bg-[#79C2EF]
                    text-white
                    text-3xl
                    flex
                    items-center
                    justify-center
                    transition-all
                "
            >

                ×

            </button>

            {/* =====================================
                FLECHA IZQUIERDA
            ===================================== */}

            {photos.length > 1 && (

                <button
                    type="button"
                    aria-label="Imagen anterior"
                    onClick={(event) => {

                        event.stopPropagation();

                        onPrevious();

                    }}
                    className="
                        absolute
                        left-4
                        sm:left-7
                        top-1/2
                        -translate-y-1/2
                        z-50
                        w-12
                        h-12
                        sm:w-14
                        sm:h-14
                        rounded-full
                        bg-white/10
                        hover:bg-[#79C2EF]
                        text-white
                        text-3xl
                        flex
                        items-center
                        justify-center
                        transition-all
                    "
                >

                    ❮

                </button>

            )}

            {/* =====================================
                CONTENEDOR DE IMAGEN
            ===================================== */}

            <div
                className="
                    relative
                    w-[90vw]
                    h-[82vh]
                    sm:w-[88vw]
                    sm:h-[86vh]
                    flex
                    items-center
                    justify-center
                    select-none
                "
                onClick={(event) => {

                    event.stopPropagation();

                }}
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >

                <Image
                    src={image.url}
                    alt={`Imagen ${current + 1}`}
                    fill
                    priority
                    sizes="90vw"
                    draggable={false}
                    className="
                        object-contain
                    "
                    style={{
                        transform: `
                            translate(
                                ${position.x}px,
                                ${position.y}px
                            )
                            scale(${zoom})
                        `,
                        transition: dragging
                            ? "none"
                            : "transform 0.25s ease",
                        cursor:
                            zoom > 1
                                ? dragging
                                    ? "grabbing"
                                    : "grab"
                                : "zoom-in",
                    }}
                />

            </div>

            {/* =====================================
                FLECHA DERECHA
            ===================================== */}

            {photos.length > 1 && (

                <button
                    type="button"
                    aria-label="Imagen siguiente"
                    onClick={(event) => {

                        event.stopPropagation();

                        onNext();

                    }}
                    className="
                        absolute
                        right-4
                        sm:right-7
                        top-1/2
                        -translate-y-1/2
                        z-50
                        w-12
                        h-12
                        sm:w-14
                        sm:h-14
                        rounded-full
                        bg-[#79C2EF]
                        hover:bg-[#79C2EF]
                        text-white
                        text-3xl
                        flex
                        items-center
                        justify-center
                        transition-all
                    "
                >

                    ❯

                </button>

            )}

            {/* =====================================
                CONTROLES DE ZOOM
            ===================================== */}

            <div
                className="
                    absolute
                    bottom-5
                    left-5
                    z-50
                    flex
                    items-center
                    gap-1
                    bg-black/70
                    backdrop-blur-md
                    rounded-full
                    p-1
                    text-white
                "
                onClick={(event) => {

                    event.stopPropagation();

                }}
            >

                <button
                    type="button"
                    aria-label="Alejar"
                    onClick={zoomOut}
                    className="
                        w-10
                        h-10
                        rounded-full
                        hover:bg-white/20
                        text-xl
                        transition
                    "
                >

                    −

                </button>

                <button
                    type="button"
                    onClick={resetZoom}
                    className="
                        min-w-[65px]
                        h-10
                        px-3
                        rounded-full
                        hover:bg-white/20
                        text-sm
                        transition
                    "
                >

                    {Math.round(zoom * 100)}%

                </button>

                <button
                    type="button"
                    aria-label="Acercar"
                    onClick={zoomIn}
                    className="
                        w-10
                        h-10
                        rounded-full
                        hover:bg-white/20
                        text-xl
                        transition
                    "
                >

                    +

                </button>

            </div>

            {/* =====================================
                CONTADOR
            ===================================== */}

            <div
                className="
                    absolute
                    bottom-5
                    left-1/2
                    -translate-x-1/2
                    z-50
                    bg-black/70
                    backdrop-blur-md
                    text-white
                    px-5
                    py-2
                    rounded-full
                    text-sm
                "
            >

                {current + 1} / {photos.length}

            </div>

            {/* =====================================
                AYUDA
            ===================================== */}

            <div
                className="
                    hidden
                    sm:block
                    absolute
                    bottom-5
                    right-5
                    z-50
                    text-white/70
                    text-xs
                    bg-black/40
                    px-4
                    py-2
                    rounded-full
                "
            >

                Doble clic para zoom · Arrastra para mover

            </div>

        </div>

    );

}