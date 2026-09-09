import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin-auth";
import { isImageUrl } from "@/lib/media";
import type { Propiedad } from "@/types/propiedad";

function unauthorized() {
  return NextResponse.json(
    { success: false, message: "No autorizado." },
    { status: 401 }
  );
}

function getFacebookConfig() {
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  const graphVersion = process.env.FACEBOOK_GRAPH_API_VERSION?.trim();

  if (!pageId || !accessToken || !graphVersion) {
    return null;
  }

  return { pageId, accessToken, graphVersion };
}

function getPublicSiteUrl() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    "https://valhallainmobiliaria.vercel.app";

  return base.replace(/\/$/, "");
}

function facebookErrorMessage(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    payload.error &&
    typeof payload.error === "object" &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }

  return "Facebook rechazó la publicación.";
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (
      authError ||
      !authData.user ||
      !isAdminEmail(authData.user.email)
    ) {
      return unauthorized();
    }

    const config = getFacebookConfig();

    if (!config) {
      return NextResponse.json(
        {
          success: false,
          code: "FACEBOOK_NOT_CONFIGURED",
          message:
            "La publicación en Facebook todavía no está configurada en el servidor.",
        },
        { status: 503 }
      );
    }

    const body = (await request.json()) as {
      propertyId?: string;
      message?: string;
    };

    const propertyId = body.propertyId?.trim();
    const message = body.message?.trim();

    if (!propertyId) {
      return NextResponse.json(
        { success: false, message: "Falta la propiedad que deseas publicar." },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Escribe el texto de la publicación." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message: "El texto de la publicación es demasiado largo.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("propiedades")
      .select("*")
      .eq("id", propertyId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: "No encontramos la propiedad seleccionada." },
        { status: 404 }
      );
    }

    const property = data as Propiedad;
    const propertyUrl = `${getPublicSiteUrl()}/propiedades/${property.id}`;
    const graphBase = `https://graph.facebook.com/${config.graphVersion}/${config.pageId}`;

    let endpoint = `${graphBase}/feed`;
    let params = new URLSearchParams({
      message,
      link: propertyUrl,
      access_token: config.accessToken,
    });

    if (isImageUrl(property.imagen_principal)) {
      endpoint = `${graphBase}/photos`;
      params = new URLSearchParams({
        url: property.imagen_principal!,
        caption: `${message}\n\n🔗 Ver propiedad: ${propertyUrl}`,
        published: "true",
        access_token: config.accessToken,
      });
    }

    const facebookResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      cache: "no-store",
    });

    const facebookPayload = (await facebookResponse.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (!facebookResponse.ok || !facebookPayload) {
      const detail = facebookErrorMessage(facebookPayload);
      console.error("Facebook publish error:", detail);

      return NextResponse.json(
        {
          success: false,
          message:
            "No fue posible publicar en Facebook. Revisa el token y los permisos de la página.",
          detail,
        },
        { status: 502 }
      );
    }

    const postId =
      typeof facebookPayload.post_id === "string"
        ? facebookPayload.post_id
        : typeof facebookPayload.id === "string"
          ? facebookPayload.id
          : null;

    return NextResponse.json({
      success: true,
      message: "La propiedad fue publicada en Facebook.",
      postId,
      facebookUrl: postId ? `https://www.facebook.com/${postId}` : null,
    });
  } catch (error) {
    console.error("Facebook publish route error:", error);

    return NextResponse.json(
      { success: false, message: "Error interno al publicar en Facebook." },
      { status: 500 }
    );
  }
}
