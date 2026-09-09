# Publicación automática en Facebook — Valhalla Inmobiliaria

La integración ya está conectada al panel administrativo de propiedades.

## Flujo implementado

1. En `/gestion-valhalla/propiedades`, cada inmueble tiene el botón **Publicar en Facebook**.
2. Se abre una ventana con:
   - imagen principal;
   - título;
   - ciudad/barrio;
   - precio;
   - enlace a la ficha del inmueble;
   - texto promocional editable.
3. Al pulsar **Publicar en Facebook**, el navegador llama a `/api/facebook/publicar`.
4. La ruta del servidor valida que el usuario sea administrador y obtiene nuevamente la propiedad desde Supabase.
5. Si hay imagen principal válida, publica una foto en la Página de Facebook con el texto y el enlace de la propiedad.
6. Si no hay imagen principal, publica un post de enlace en el feed de la Página.

## Variables de entorno necesarias

Configura estas variables en `.env.local` para desarrollo y en Vercel para producción:

```env
NEXT_PUBLIC_SITE_URL=https://valhallainmobiliaria.vercel.app
FACEBOOK_PAGE_ID=TU_PAGE_ID
FACEBOOK_PAGE_ACCESS_TOKEN=TU_PAGE_ACCESS_TOKEN
FACEBOOK_GRAPH_API_VERSION=vXX.X
```

No agregues `NEXT_PUBLIC_` a `FACEBOOK_PAGE_ACCESS_TOKEN`. El token debe permanecer exclusivamente en el servidor.

## Permisos de Meta

La app/token de Meta debe estar autorizado para administrar publicaciones de la Página. Al configurar la app en Meta, usa un Page Access Token válido para la Página oficial de Valhalla y concede los permisos de Página que Meta exija para publicar y consultar la Página en la versión de Graph API que tengas activa.

La versión de Graph API quedó como variable de entorno a propósito, para que pueda actualizarse sin tocar el código cuando Meta cambie las versiones disponibles.

## Archivos agregados o modificados

- `src/components/admin/PropertyList.tsx`
- `src/components/admin/FacebookPublisher.tsx`
- `src/app/api/facebook/publicar/route.ts`
- `.env.example`
- `FACEBOOK_PUBLICACION.md`

## Seguridad

- El token nunca se envía al cliente.
- La ruta de publicación verifica sesión de Supabase y `ADMIN_EMAILS`.
- El `propertyId` recibido del navegador se vuelve a consultar en Supabase; el cliente no decide qué imagen, precio o URL se envía a Facebook.
- El servidor limita el texto de la publicación y no devuelve el token en respuestas de error.
