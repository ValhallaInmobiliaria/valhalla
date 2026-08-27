import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { sanitizeImageUrl, sanitizeVideoUrl } from "@/lib/media";
import { isAdminEmail } from "@/lib/admin-auth";

type NormalizedProperty = Record<string, unknown> & {
  titulo: unknown;
  codigo: unknown;
  tipo: unknown;
  operacion: unknown;
  ciudad: unknown;
  barrio: unknown;
  direccion: unknown;
  precio: unknown;
  imagen_principal: string | null;
  video: string | null;
  mapa: unknown;
};

async function getAuthenticatedClient() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user || !isAdminEmail(data.user.email)) {
    return null;
  }

  return supabase;
}

function normalizePropertyBody(
  body: Record<string, unknown>
): NormalizedProperty {
  const { id: _id, ...property } = body;

  return {
    ...property,

    titulo:
      typeof property.titulo === "string"
        ? property.titulo.trim()
        : property.titulo,

    codigo:
      typeof property.codigo === "string"
        ? property.codigo.trim() || null
        : property.codigo,

    tipo:
      typeof property.tipo === "string"
        ? property.tipo.trim()
        : property.tipo,

    operacion:
      typeof property.operacion === "string"
        ? property.operacion.trim()
        : property.operacion,

    ciudad:
      typeof property.ciudad === "string"
        ? property.ciudad.trim()
        : property.ciudad,

    barrio:
      typeof property.barrio === "string"
        ? property.barrio.trim() || null
        : property.barrio,

    direccion:
      typeof property.direccion === "string"
        ? property.direccion.trim() || null
        : property.direccion,

    precio: property.precio,

    imagen_principal: sanitizeImageUrl(property.imagen_principal),

    video: sanitizeVideoUrl(property.video),

    mapa:
      typeof property.mapa === "string"
        ? property.mapa.trim() || null
        : property.mapa,
  };
}

function unauthorized() {
  return NextResponse.json(
    {
      success: false,
      message: "No autorizado.",
    },
    {
      status: 401,
    }
  );
}

export async function POST(request: Request) {
  try {
    const supabase = await getAuthenticatedClient();

    if (!supabase) {
      return unauthorized();
    }

    const body = await request.json();

    const property = normalizePropertyBody(body ?? {});

    if (body?.video && !property.video) {
      return NextResponse.json(
        {
          success: false,
          message:
            "El video debe ser una URL directa válida o un enlace de YouTube válido.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !property.titulo ||
      !property.tipo ||
      !property.operacion ||
      !property.ciudad ||
      !property.precio
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Completa los campos obligatorios.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabase
      .from("propiedades")
      .insert([property])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await getAuthenticatedClient();

    if (!supabase) {
      return unauthorized();
    }

    const body = await request.json();

    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Falta el identificador de la propiedad.",
        },
        {
          status: 400,
        }
      );
    }

    const property = normalizePropertyBody(body ?? {});

    if (body?.video && !property.video) {
      return NextResponse.json(
        {
          success: false,
          message:
            "El video debe ser una URL directa válida o un enlace de YouTube válido.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabase
      .from("propiedades")
      .update(property)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await getAuthenticatedClient();

    if (!supabase) {
      return unauthorized();
    }

    const body = await request.json();

    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Falta el identificador de la propiedad.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabase
      .from("propiedades")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor.",
      },
      {
        status: 500,
      }
    );
  }
}