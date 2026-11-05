-- =====================================================================
-- Paso 2 — Gestión de contenido por el administrador
-- Pegá TODO este archivo en Supabase > SQL Editor > New query > Run.
-- (Correr antes setup.sql.) Es seguro correrlo más de una vez.
-- Agrega: eliminar fotos, eliminar/modificar noticias y administrar
-- las personas del Cuerpo Activo y de la Comisión Directiva.
-- =====================================================================

-- ---------- Fotos y noticias: eliminar / modificar ----------
drop policy if exists "photos: admin elimina" on public.photos;
create policy "photos: admin elimina" on public.photos
  for delete to authenticated using (public.is_admin());

drop policy if exists "news: admin modifica" on public.news;
create policy "news: admin modifica" on public.news
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "news: admin elimina" on public.news;
create policy "news: admin elimina" on public.news
  for delete to authenticated using (public.is_admin());

-- Permitir al admin borrar los archivos de imagen de Storage
drop policy if exists "imagenes: admin elimina" on storage.objects;
create policy "imagenes: admin elimina" on storage.objects
  for delete to authenticated
  using (bucket_id in ('gallery','news') and public.is_admin());

drop policy if exists "imagenes: admin ve" on storage.objects;
create policy "imagenes: admin ve" on storage.objects
  for select to authenticated
  using (bucket_id in ('gallery','news') and public.is_admin());

-- ---------- Cuerpo Activo ----------
create table if not exists public.members (
  id         bigint generated always as identity primary key,
  first_name text not null check (char_length(first_name) between 1 and 60),
  last_name  text not null check (char_length(last_name)  between 1 and 60),
  rank       text not null check (rank in ('Jefe','Sub Jefe','Oficial','Sub Oficial','Bombero')),
  created_at timestamptz not null default now()
);

-- ---------- Comisión Directiva ----------
create table if not exists public.board_members (
  id         bigint generated always as identity primary key,
  first_name text not null check (char_length(first_name) between 1 and 60),
  last_name  text not null check (char_length(last_name)  between 1 and 60),
  role       text not null check (role in ('Presidente','Vicepresidente','Secretario','Tesorero','Vocal','Órgano de fiscalización')),
  created_at timestamptz not null default now()
);

alter table public.members       enable row level security;
alter table public.board_members enable row level security;

drop policy if exists "members: ver todos"    on public.members;
drop policy if exists "members: admin agrega" on public.members;
drop policy if exists "members: admin elimina" on public.members;
create policy "members: ver todos"     on public.members for select using (true);
create policy "members: admin agrega"  on public.members for insert to authenticated with check (public.is_admin());
create policy "members: admin elimina" on public.members for delete to authenticated using (public.is_admin());

drop policy if exists "board: ver todos"     on public.board_members;
drop policy if exists "board: admin agrega"  on public.board_members;
drop policy if exists "board: admin elimina" on public.board_members;
create policy "board: ver todos"     on public.board_members for select using (true);
create policy "board: admin agrega"  on public.board_members for insert to authenticated with check (public.is_admin());
create policy "board: admin elimina" on public.board_members for delete to authenticated using (public.is_admin());

-- ---------- Datos iniciales (solo si las tablas están vacías) ----------
insert into public.members (first_name, last_name, rank)
select v.first_name, v.last_name, v.rank
from (values
  (1,  'Maximiliano', 'Ruzzo',       'Jefe'),
  (2,  'Raúl',        'Campagnaro',  'Sub Jefe'),
  (3,  'Andrés',      'Taborda',     'Sub Oficial'),
  (4,  'Romina',      'Ringellmann', 'Sub Oficial'),
  (5,  'Brian',       'Godoy',       'Sub Oficial'),
  (6,  'Ramiro',      'Gonzalez',    'Sub Oficial'),
  (7,  'Andrés',      'Soressi',     'Bombero'),
  (8,  'Victoria',    'Mariani',     'Bombero'),
  (9,  'Eduardo',     'Ramírez',     'Bombero'),
  (10, 'Thiago',      'Campagnaro',  'Bombero'),
  (11, 'Víctor',      'Monzón',      'Bombero'),
  (12, 'Danilo',      'Colmegna',    'Bombero'),
  (13, 'Katia',       'Pereira',     'Bombero'),
  (14, 'Nicolás',     'Pérez',       'Bombero'),
  (15, 'Pablo',       'De Bonis',    'Bombero'),
  (16, 'Cindi',       'Rinaldo',     'Bombero'),
  (17, 'Estefanía',   'Vallejos',    'Bombero'),
  (18, 'Leonardo',    'Aguirre',     'Bombero'),
  (19, 'Adrián',      'Gonzalez',    'Bombero'),
  (20, 'Esteban',     'Rovera',      'Bombero')
) as v(ord, first_name, last_name, rank)
where not exists (select 1 from public.members)
order by v.ord;

insert into public.board_members (first_name, last_name, role)
select v.first_name, v.last_name, v.role
from (values
  (1, 'Juan Pablo', 'Caniggiani', 'Presidente'),
  (2, 'Aníbal',     'Morton',     'Vicepresidente')
) as v(ord, first_name, last_name, role)
where not exists (select 1 from public.board_members)
order by v.ord;
