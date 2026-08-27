-- VALHALLA INMOBILIARIA: REPARACIÓN Y CONFIGURACIÓN DE MULTIMEDIA
-- Ejecuta este archivo en Supabase SQL Editor.

-- 1) Reparar referencias antiguas de video guardadas como imagen principal.
update public.propiedades
set video = coalesce(nullif(video, ''), imagen_principal),
    imagen_principal = null
where imagen_principal ~* '\\.(mp4|webm|mov|m4v|ogg|ogv|avi|mkv)(\\?.*)?$';

delete from public.imagenes_propiedad
where url ~* '\\.(mp4|webm|mov|m4v|ogg|ogv|avi|mkv)(\\?.*)?$';

-- 2) Normalizar el orden de la galería por propiedad.
with ordenadas as (
  select id, row_number() over (partition by propiedad_id order by coalesce(orden, 999999), id) as nuevo_orden
  from public.imagenes_propiedad
)
update public.imagenes_propiedad i
set orden = o.nuevo_orden
from ordenadas o
where i.id = o.id;

-- 3) Aumentar el límite real del bucket a 500 MB.
-- La aplicación ya no impone un límite artificial de 80 MB.
-- Cambia 524288000 por null si tu proyecto/plan permite no establecer límite.
update storage.buckets
set file_size_limit = 524288000
where id = 'propiedades';

-- Si prefieres gestionar el límite desde el Dashboard de Supabase,
-- omite el bloque anterior y configura Storage > propiedades > File size limit.
