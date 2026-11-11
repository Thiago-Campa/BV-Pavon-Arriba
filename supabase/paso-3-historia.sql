-- =====================================================================
-- Paso 3 — Textos editables del sitio (Nuestra historia)
-- Pegá TODO este archivo en Supabase > SQL Editor > New query > Run.
-- (Correr después de setup.sql.) Es seguro correrlo más de una vez.
-- =====================================================================

create table if not exists public.site_content (
  key        text primary key,
  value      text not null check (char_length(value) between 1 and 20000),
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "content: ver todos"     on public.site_content;
drop policy if exists "content: admin agrega"  on public.site_content;
drop policy if exists "content: admin modifica" on public.site_content;

create policy "content: ver todos"      on public.site_content for select using (true);
create policy "content: admin agrega"   on public.site_content for insert to authenticated with check (public.is_admin());
create policy "content: admin modifica" on public.site_content for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Texto inicial de la historia (solo si todavía no existe). Los párrafos se separan con una línea en blanco.
insert into public.site_content (key, value)
values ('history', $hist$Acá va la historia de los Bomberos Voluntarios de Pavón Arriba: cuándo y por qué se fundó el cuartel, quiénes fueron sus primeros integrantes, y los hitos más importantes del camino recorrido.

Podés escribir varios párrafos — cada uno va a aparecer como un bloque de texto separado. Cuando tengas el contenido definitivo, reemplazá estos textos de ejemplo en el archivo src/data.js.$hist$)
on conflict (key) do nothing;
