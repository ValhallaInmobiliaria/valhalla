# Cambios de WhatsApp y catálogo

## WhatsApp independientes

El proyecto ahora usa dos variables públicas:

```env
NEXT_PUBLIC_WHATSAPP_VENTAS=573102897401
NEXT_PUBLIC_WHATSAPP_ARRIENDOS=573102897401
```

Cambia el segundo número por el WhatsApp real de arriendos y deja el de ventas en el número correspondiente.

En Vercel deben configurarse las dos variables en **Project Settings → Environment Variables** para Production, Preview y Development según corresponda.

`NEXT_PUBLIC_WHATSAPP_NUMBER` se mantiene como compatibilidad con la configuración anterior, pero las nuevas variables tienen prioridad.

## Correspondencia de propiedades

Las páginas públicas trabajan así:

- `/comprar`: propiedades con `publicado = true` cuya operación es `Venta` o `Venta y Arriendo`.
- `/arrendar`: propiedades con `publicado = true` cuya operación es `Arriendo` o `Venta y Arriendo`.
- `/propiedades`: mantiene todas las propiedades publicadas y permite filtrar por operación.
- Las diferencias de mayúsculas, tildes y espacios no impiden que una propiedad sea encontrada.
- También se reconocen variantes antiguas como `Alquiler` o `Arrendamiento` para evitar catálogos vacíos si alguna fila histórica usa esos valores.

Además, cuando una propiedad de `Venta y Arriendo` se abre desde Comprar o Arrendar, el enlace conserva el canal (`canal=ventas` o `canal=arriendos`) para que el botón de WhatsApp del detalle llegue al número correcto.

## Base de datos

No es obligatorio ejecutar una migración para que el código funcione. Si se desea dejar los valores históricos uniformes, puede ejecutarse una limpieza en Supabase revisando primero los valores existentes:

```sql
select operacion, publicado, count(*)
from propiedades
group by operacion, publicado
order by operacion, publicado;
```

Después de revisar los resultados, se pueden normalizar manualmente los valores incorrectos. No se incluye un `UPDATE` destructivo automático para no modificar inventario sin revisión.
