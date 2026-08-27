-- SEGURIDAD RECOMENDADA PARA EL PANEL ADMINISTRATIVO
-- Ejecuta este SQL en Supabase después de comprobar que el panel funciona.
--
-- NO cambia la estructura de las tablas.
-- Permite lectura pública y reserva las escrituras a usuarios autenticados.

alter table public.propiedades enable row level security;
alter table public.imagenes_propiedad enable row level security;

drop policy if exists "public can read properties" on public.propiedades;
create policy "public can read properties"
on public.propiedades
for select
to anon, authenticated
using (true);

drop policy if exists "authenticated can insert properties" on public.propiedades;
create policy "authenticated can insert properties"
on public.propiedades
for insert
to authenticated
with check (true);

drop policy if exists "authenticated can update properties" on public.propiedades;
create policy "authenticated can update properties"
on public.propiedades
for update
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated can delete properties" on public.propiedades;
create policy "authenticated can delete properties"
on public.propiedades
for delete
to authenticated
using (true);

drop policy if exists "public can read property images" on public.imagenes_propiedad;
create policy "public can read property images"
on public.imagenes_propiedad
for select
to anon, authenticated
using (true);

drop policy if exists "authenticated can insert property images" on public.imagenes_propiedad;
create policy "authenticated can insert property images"
on public.imagenes_propiedad
for insert
to authenticated
with check (true);

drop policy if exists "authenticated can update property images" on public.imagenes_propiedad;
create policy "authenticated can update property images"
on public.imagenes_propiedad
for update
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated can delete property images" on public.imagenes_propiedad;
create policy "authenticated can delete property images"
on public.imagenes_propiedad
for delete
to authenticated
using (true);

-- STORAGE: el bucket "propiedades" se mantiene público para que las
-- fotografías y videos puedan verse en la web pública.
--
-- Las operaciones de escritura se restringen a usuarios autenticados.
drop policy if exists "public can read property storage" on storage.objects;
create policy "public can read property storage"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'propiedades');

drop policy if exists "authenticated can upload property storage" on storage.objects;
create policy "authenticated can upload property storage"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'propiedades');

drop policy if exists "authenticated can update property storage" on storage.objects;
create policy "authenticated can update property storage"
on storage.objects
for update
to authenticated
using (bucket_id = 'propiedades')
with check (bucket_id = 'propiedades');

drop policy if exists "authenticated can delete property storage" on storage.objects;
create policy "authenticated can delete property storage"
on storage.objects
for delete
to authenticated
using (bucket_id = 'propiedades');
