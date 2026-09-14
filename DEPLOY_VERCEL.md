# Despliegue de Valhalla en Vercel

## Cambios preparados

- Las imágenes de propiedades alojadas en Supabase se sirven directamente desde su URL de origen (`unoptimized`) para evitar que cada imagen pase por el optimizador `/_next/image` de Vercel.
- Esto aplica a las tarjetas públicas y a la galería pública de propiedades.
- Se mantienen las imágenes locales de la aplicación con `next/image`.
- No se modificó Supabase, el `proxy` ni la protección DDoS de Vercel.

## Variables de entorno

En Vercel → Project Settings → Environment Variables, configura las variables que aparecen en `.env.example` con los valores de tu entorno. No subas `.env.local` al repositorio ni al proyecto de despliegue.

Variables esperadas:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_WHATSAPP_VENTAS`
- `NEXT_PUBLIC_WHATSAPP_ARRIENDOS`
- `ADMIN_EMAILS`

## Despliegue

1. En Vercel selecciona **Add New → Project**.
2. Importa este proyecto.
3. Framework: **Next.js** (detección automática).
4. Build Command: `npm run build`.
5. Install Command: `npm install` (o `npm ci`).
6. Agrega las variables de entorno anteriores para Production y Preview según corresponda.
7. Despliega.

## Verificación después del despliegue

1. Abre la página principal desde un teléfono Android conectado a la Wi-Fi problemática.
2. Abre una propiedad y revisa la galería.
3. En Vercel → Firewall → Traffic revisa si disminuye el volumen de solicitudes a `/_next/image`.
4. Comprueba también `/favicon.ico`.

### Importante

Este cambio reduce solicitudes al optimizador de imágenes de Vercel, pero no puede garantizar por sí solo que desaparezca un falso positivo de `sys_dos_mitigation`. Si Vercel continúa devolviendo 403 a clientes legítimos, el caso debe escalarse a Vercel Support como falso positivo de DDoS Mitigation.
