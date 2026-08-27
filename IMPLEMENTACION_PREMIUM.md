# Valhalla Inmobiliaria — rediseño premium

## Identidad visual
- Azul principal: #0016A2
- Azul secundario: #79C2EF
- Superficie principal: #F3F7FC
- Blanco reservado principalmente para tarjetas y áreas de contraste.
- Verde de WhatsApp se conserva únicamente como color funcional del canal WhatsApp.

## Cambios principales
- Navbar premium sticky con estado al hacer scroll y menú móvil funcional.
- Home completamente rediseñada con hero, CTA, catálogo, propiedades destacadas, servicios, nosotros y captación de propietarios.
- Catálogo con filtros funcionales sobre las propiedades publicadas.
- Nueva ruta /propiedades.
- /comprar y /arrendar ahora muestran el catálogo real con filtro inicial por operación.
- Página de detalle de propiedad rediseñada y conectada a la galería, video, mapa y WhatsApp existente.
- Página /contacto funcional usando los canales de contacto existentes; no se inventó un backend de formulario.
- Footer premium con enlaces sociales existentes.
- Metadata y estructura SEO base mejoradas.
- Colores antiguos naranja/azul reemplazados en los componentes restantes para mantener coherencia visual.
- Se corrigió la incompatibilidad de props en FeaturedProperties.
- Se añadió src/lib/site.ts para centralizar WhatsApp, redes y colores de marca.
- Se añadió .env.example sin secretos.

## Base de datos
No se cambió el esquema de Supabase. Se mantienen las tablas y campos que el proyecto ya utilizaba, incluyendo `propiedades` e `imagenes_propiedad`.

## Dependencias
No se agregaron dependencias nuevas.

## Variables de entorno
Conserva tu `.env.local` actual. El proyecto necesita:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_WHATSAPP_NUMBER

## Verificación
Se hizo una comprobación de sintaxis TypeScript/TSX de todos los archivos fuente y una comprobación estática de imports/rutas locales. La instalación completa de dependencias no pudo finalizar en este entorno por una dependencia no disponible en la caché de npm, por lo que el build de Next debe ejecutarse localmente después de `npm install`/`npm ci`.
