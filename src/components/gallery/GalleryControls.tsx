"use client";

interface GalleryControlsProps {
    onPrevious: () => void;
    onNext: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
    onClose: () => void;
    zoom: number;
    showNavigation?: boolean;
}

export default function GalleryControls({
    onPrevious,
    onNext,
    onZoomIn,
    onZoomOut,
    onResetZoom,
    onClose,
    zoom,
    showNavigation = true,
}: GalleryControlsProps) {

    return (
        <>
            {/* Botón cerrar */}

            <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar galería"
                className="
                    absolute
                    top-5
                    right-5
                    z-50
                    w-12
                    h-12
                    rounded-full
                    bg-black/60
                    backdrop-blur
                    text-white
                    text-3xl
                    flex
                    items-center
                    justify-center
                    hover:bg-[#79C2EF]
                    transition-all
                    duration-300
                "
            >
                ×
            </button>

            {/* Navegación izquierda */}

            {showNavigation && (

                <button
                    type="button"
                    onClick={onPrevious}
                    aria-label="Imagen anterior"
                    className="
                        absolute
                        left-5
                        top-1/2
                        -translate-y-1/2
                        z-50
                        w-14
                        h-14
                        rounded-full
                        bg-black/50
                        backdrop-blur
                        text-white
                        text-3xl
                        flex
                        items-center
                        justify-center
                        hover:bg-[#79C2EF]
                        transition-all
                        duration-300
                    "
                >
                    ❮
                </button>

            )}

            {/* Navegación derecha */}

            {showNavigation && (

                <button
                    type="button"
                    onClick={onNext}
                    aria-label="Imagen siguiente"
                    className="
                        absolute
                        right-5
                        top-1/2
                        -translate-y-1/2
                        z-50
                        w-14
                        h-14
                        rounded-full
                        bg-black/50
                        backdrop-blur
                        text-white
                        text-3xl
                        flex
                        items-center
                        justify-center
                        hover:bg-[#79C2EF]
                        transition-all
                        duration-300
                    "
                >
                    ❯
                </button>

            )}

            {/* Controles de zoom */}

            <div
                className="
                    absolute
                    bottom-5
                    left-5
                    z-50
                    flex
                    items-center
                    gap-2
                    bg-black/60
                    backdrop-blur
                    rounded-full
                    p-2
                "
            >

                {/* Zoom menos */}

                <button
                    type="button"
                    onClick={onZoomOut}
                    aria-label="Alejar"
                    disabled={zoom <= 1}
                    className="
                        w-10
                        h-10
                        rounded-full
                        text-white
                        text-2xl
                        flex
                        items-center
                        justify-center
                        hover:bg-white/20
                        disabled:opacity-30
                        disabled:cursor-not-allowed
                        transition
                    "
                >
                    −
                </button>

                {/* Porcentaje */}

                <button
                    type="button"
                    onClick={onResetZoom}
                    aria-label="Restablecer zoom"
                    className="
                        min-w-[65px]
                        h-10
                        px-3
                        rounded-full
                        text-white
                        text-sm
                        font-medium
                        hover:bg-white/20
                        transition
                    "
                >
                    {Math.round(zoom * 100)}%
                </button>

                {/* Zoom más */}

                <button
                    type="button"
                    onClick={onZoomIn}
                    aria-label="Acercar"
                    disabled={zoom >= 4}
                    className="
                        w-10
                        h-10
                        rounded-full
                        text-white
                        text-2xl
                        flex
                        items-center
                        justify-center
                        hover:bg-white/20
                        disabled:opacity-30
                        disabled:cursor-not-allowed
                        transition
                    "
                >
                    +
                </button>

            </div>
        </>
    );
}