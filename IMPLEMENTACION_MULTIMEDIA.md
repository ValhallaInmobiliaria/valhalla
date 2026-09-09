# Implementación multimedia corregida

## Cambios incluidos

- Se eliminó el límite artificial de 80 MB en el formulario.
- Los videos se suben directamente al bucket `propiedades` dentro de `videos/`.
- El video subido muestra una vista previa con controles antes de guardar la propiedad.
- Los enlaces de YouTube se normalizan para `watch`, `youtu.be`, `shorts`, `live` y `embed`.
- La URL de YouTube también muestra una vista previa en el panel.
- Las imágenes de galería se pueden eliminar individualmente.
- Al eliminar una imagen se elimina su fila de `imagenes_propiedad` y se intenta eliminar su archivo de Storage.
- Las imágenes se pueden mover a izquierda/derecha y el orden se persiste en `orden`.
- Cualquier imagen de la galería puede convertirse en imagen principal.
- La imagen principal no se duplica en la galería pública.
- La API valida que el valor de `video` sea un video directo o una URL válida de YouTube.

## Paso obligatorio en Supabase

Ejecuta una vez:

`supabase/media-repair.sql`

Ese archivo repara referencias antiguas y configura el bucket `propiedades` con un límite de 500 MB. Si deseas otro límite, cambia `524288000` por el número de bytes correspondiente o configúralo desde Storage en Supabase.

## Flujo recomendado

1. Crea la propiedad y guárdala.
2. Sube la imagen principal o selecciona una imagen de la galería como principal.
3. Sube las imágenes adicionales, ordénalas y elimina las que no quieras.
4. Sube un video o pega una URL válida de YouTube.
5. Comprueba la vista previa.
6. Pulsa `Actualizar propiedad` para guardar la URL del video y la imagen principal.

## Nota sobre archivos grandes

La aplicación ya no bloquea por tamaño. El límite final depende del bucket y del proyecto de Supabase. Si Supabase rechaza un archivo grande, revisa primero `Storage > propiedades > File size limit` y las políticas del bucket.
