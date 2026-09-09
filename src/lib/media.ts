const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "avif",
  "bmp",
];

const VIDEO_EXTENSIONS = [
  "mp4",
  "webm",
  "mov",
  "m4v",
  "ogg",
  "ogv",
  "avi",
  "mkv",
];

function cleanUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const url = value.trim();

  return url.length > 0 ? url : null;
}

function extensionFromUrl(url: string): string {
  const pathname = url.split("?")[0].split("#")[0];

  const match = pathname.match(/\.([a-z0-9]+)$/i);

  return match?.[1]?.toLowerCase() ?? "";
}

export function isImageUrl(value: unknown): value is string {
  const url = cleanUrl(value);

  if (!url) return false;

  const ext = extensionFromUrl(url);

  // Si tiene una extensión de video, definitivamente no es imagen.
  if (VIDEO_EXTENSIONS.includes(ext)) {
    return false;
  }

  // Extensiones conocidas de imagen.
  if (IMAGE_EXTENSIONS.includes(ext)) {
    return true;
  }

  // Para URLs de Supabase Storage u otros servicios que no
  // necesariamente tengan extensión, evitamos rutas claramente
  // relacionadas con videos.
  return !/\/(videos?|media)\//i.test(url) && !/video/i.test(url);
}

export function isDirectVideoUrl(value: unknown): value is string {
  const url = cleanUrl(value);

  if (!url) return false;

  const ext = extensionFromUrl(url);

  return VIDEO_EXTENSIONS.includes(ext);
}

export function getYouTubeEmbedUrl(value: unknown): string | null {
  const url = cleanUrl(value);

  if (!url) return null;

  try {
    const parsed = new URL(url);

    const hostname = parsed.hostname
      .toLowerCase()
      .replace(/^www\./, "");

    let videoId: string | null = null;

    // youtube.com
    if (
      hostname === "youtube.com" ||
      hostname.endsWith(".youtube.com")
    ) {
      // https://youtube.com/watch?v=VIDEO_ID
      if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v");
      }

      // https://youtube.com/embed/VIDEO_ID
      else if (parsed.pathname.startsWith("/embed/")) {
        videoId =
          parsed.pathname
            .replace("/embed/", "")
            .split("/")[0] || null;
      }

      // https://youtube.com/shorts/VIDEO_ID
      else if (parsed.pathname.startsWith("/shorts/")) {
        videoId =
          parsed.pathname
            .replace("/shorts/", "")
            .split("/")[0] || null;
      }

      // https://youtube.com/live/VIDEO_ID
      else if (parsed.pathname.startsWith("/live/")) {
        videoId =
          parsed.pathname
            .replace("/live/", "")
            .split("/")[0] || null;
      }
    }

    // https://youtu.be/VIDEO_ID
    else if (hostname === "youtu.be") {
      videoId =
        parsed.pathname
          .replace(/^\/+/, "")
          .split("/")[0] || null;
    }

    if (!videoId) {
      return null;
    }

    // Los IDs de YouTube normalmente tienen 11 caracteres.
    // Esta validación permite formatos válidos sin ser demasiado restrictiva.
    if (!/^[A-Za-z0-9_-]{6,}$/.test(videoId)) {
      return null;
    }

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

export function isYouTubeUrl(value: unknown): value is string {
  return getYouTubeEmbedUrl(value) !== null;
}

export function imageUrls<
  T extends {
    url?: unknown;
  }
>(items: T[] | null | undefined): T[] {
  return (items ?? []).filter((item) => isImageUrl(item?.url));
}

export function sanitizeImageUrl(value: unknown): string | null {
  const url = cleanUrl(value);

  if (!url) return null;

  return isImageUrl(url) ? url : null;
}

export function sanitizeVideoUrl(value: unknown): string | null {
  const url = cleanUrl(value);

  if (!url) return null;

  if (isDirectVideoUrl(url)) {
    return url;
  }

  if (isYouTubeUrl(url)) {
    return url;
  }

  return null;
}

export function storagePathFromPublicUrl(
  value: string,
  bucket = "propiedades"
): string | null {
  try {
    const url = new URL(value);

    const marker = `/storage/v1/object/public/${bucket}/`;

    const index = url.pathname.indexOf(marker);

    if (index < 0) {
      return null;
    }

    return decodeURIComponent(
      url.pathname.slice(index + marker.length)
    );
  } catch {
    return null;
  }
}