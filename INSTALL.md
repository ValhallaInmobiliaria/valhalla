# Valhalla — panel administrativo

## 1. Dependencia

En la raíz del proyecto ejecuta:

```bash
npm install @supabase/ssr
```

Tu proyecto ya utiliza `@supabase/supabase-js`, por lo que no es necesario reinstalarlo si ya aparece en `package.json`.

## 2. Variables

Copia `.env.example` como `.env.local` y conserva tus valores reales de Supabase. Configura los correos administradores con:

```env
ADMIN_EMAILS=TU_CORREO_ADMINISTRADOR
```

Si tu proyecto ya utiliza `NEXT_PUBLIC_SUPABASE_ANON_KEY`, puedes conservarla. El código también acepta `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## 3. Crear el usuario administrador

En Supabase:

Authentication → Users → Add user

Crea el correo y contraseña que utilizarás para el panel.

El correo debe coincidir con `ADMIN_EMAILS`.

## 4. Seguridad de Supabase

Ejecuta `supabase/admin-security.sql` en el SQL Editor y, si ya tienes videos guardados como imágenes, ejecuta también `supabase/media-repair.sql`.

## 5. Rutas

Panel:

`/gestion-valhalla`

Login:

`/gestion-valhalla/login`

Propiedades:

`/gestion-valhalla/propiedades`

Nueva:

`/gestion-valhalla/nueva`

Editar:

`/gestion-valhalla/editar/[id]`

Las rutas antiguas `/admin` fueron eliminadas para evitar duplicados y conflictos de rutas.

## 6. Ejecutar

```bash
npm install
npm run dev
```
