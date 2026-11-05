-- =====================================================================
-- Bomberos Pavón Arriba — configuración de Supabase
-- Pegá TODO este archivo en Supabase > SQL Editor > New query > Run.
-- Es seguro correrlo más de una vez.
-- =====================================================================

-- ---------- Tablas ----------
create table if not exists public.photos (
  id         bigint generated always as identity primary key,
  src        text not null,
  caption    text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.news (
  id         bigint generated always as identity primary key,
  date       date not null default current_date,
  title      text not null check (char_length(title) between 1 and 150),
  body       text not null check (char_length(body) between 1 and 5000),
  image      text not null default '',
  created_at timestamptz not null default now()
);

-- Lista de administradores (usuarios de Supabase Auth que pueden publicar)
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- ---------- ¿El usuario actual es admin? ----------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Seguridad por filas (RLS) ----------
alter table public.photos enable row level security;
alter table public.news   enable row level security;
alter table public.admins enable row level security;

drop policy if exists "photos: ver todos"      on public.photos;
drop policy if exists "photos: admin agrega"   on public.photos;
drop policy if exists "news: ver todos"        on public.news;
drop policy if exists "news: admin agrega"     on public.news;
drop policy if exists "admins: ver el propio"  on public.admins;

create policy "photos: ver todos"    on public.photos for select using (true);
create policy "photos: admin agrega" on public.photos for insert to authenticated with check (public.is_admin());

create policy "news: ver todos"      on public.news for select using (true);
create policy "news: admin agrega"   on public.news for insert to authenticated with check (public.is_admin());

-- Cada usuario solo puede ver si él mismo es admin. Nadie puede agregar admins desde la web.
create policy "admins: ver el propio" on public.admins for select to authenticated using (user_id = auth.uid());

-- ---------- Almacenamiento de imágenes ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('gallery', 'gallery', true, 8388608, array['image/jpeg','image/png','image/webp','image/gif']),
  ('news',    'news',    true, 8388608, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "imagenes: admin sube" on storage.objects;
create policy "imagenes: admin sube" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('gallery','news') and public.is_admin());

-- ---------- Datos iniciales (solo si las tablas están vacías) ----------
insert into public.photos (src, caption)
select '/gallery/galeria ' || n || '.png', ''
from generate_series(1, 12) as n
where not exists (select 1 from public.photos)
order by n desc;

insert into public.news (date, title, body, image)
select date '2026-09-12',
       'Ultima salida',
       'Socorrimos a dotacion correspondiente al cuartel de la localidad de Maximo Paz, por causa de un incedio forestal.',
       ''
where not exists (select 1 from public.news);

-- =====================================================================
-- DESPUÉS de crear tu usuario en Authentication > Users, corré esto
-- (cambiá el mail por el tuyo) para convertirlo en administrador:
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'TU_MAIL@ejemplo.com'
--   on conflict do nothing;
-- =====================================================================
