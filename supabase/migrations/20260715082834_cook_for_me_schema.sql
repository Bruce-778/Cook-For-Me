
create extension if not exists pgcrypto;

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  image_path text not null,
  category text not null,
  tags text[] not null default '{}',
  aliases text[] not null default '{}',
  diet_type text not null check (diet_type in ('荤','素','半荤素')),
  nutrition_roles text[] not null default '{}',
  cooking_method text not null,
  spice_level smallint not null default 0 check (spice_level between 0 and 3),
  allergens text[] not null default '{}',
  baby_age_min smallint,
  baby_age_max smallint,
  difficulty smallint not null check (difficulty between 1 and 5),
  prep_minutes smallint not null check (prep_minutes >= 0),
  active_minutes smallint not null check (active_minutes >= 0),
  wait_minutes smallint not null check (wait_minutes >= 0),
  servings smallint not null check (servings between 1 and 8),
  bilibili_video_url text,
  bilibili_search_url text not null,
  video_title text,
  video_creator text,
  video_verified_at date,
  status text not null default 'published' check (status in ('draft','review','published')),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipe_ingredients (
  id bigint generated always as identity primary key,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  name text not null,
  amount numeric(10,2) not null check (amount > 0),
  unit text not null,
  note text,
  group_name text not null check (group_name in ('主料','辅料','调料')),
  sort_order smallint not null default 0
);

create table public.recipe_steps (
  id bigint generated always as identity primary key,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  step_number smallint not null check (step_number > 0),
  title text not null,
  body text not null,
  heat text not null default '不适用',
  water_temperature text not null default '不适用',
  oil_amount_ml numeric(8,2),
  oil_temperature text not null default '不适用',
  timer_seconds integer check (timer_seconds is null or timer_seconds > 0),
  completion_cue text not null,
  safety_note text,
  unique (recipe_id, step_number)
);

create table public.recipe_step_ingredients (
  step_id bigint not null references public.recipe_steps(id) on delete cascade,
  ingredient_id bigint not null references public.recipe_ingredients(id) on delete cascade,
  amount numeric(10,2) not null check (amount > 0),
  primary key (step_id, ingredient_id)
);

create table public.recipe_tips (
  id bigint generated always as identity primary key,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  kind text not null check (kind in ('tip','failure','safety')),
  body text not null,
  sort_order smallint not null default 0
);

create table public.recipe_sources (
  id bigint generated always as identity primary key,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  name text not null,
  url text not null,
  source_type text not null check (source_type in ('guideline','article','video')),
  verified_at date not null,
  notes text
);

create table public.recipe_likes (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (recipe_id, user_id)
);

create index recipe_likes_created_at_idx on public.recipe_likes (created_at desc);
create index recipe_likes_user_id_idx on public.recipe_likes (user_id);
create index recipes_category_idx on public.recipes (category) where status = 'published';
create index recipes_tags_idx on public.recipes using gin (tags);

alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.recipe_steps enable row level security;
alter table public.recipe_step_ingredients enable row level security;
alter table public.recipe_tips enable row level security;
alter table public.recipe_sources enable row level security;
alter table public.recipe_likes enable row level security;

create policy "published recipes are readable" on public.recipes for select to anon, authenticated using (status = 'published');
create policy "published ingredients are readable" on public.recipe_ingredients for select to anon, authenticated using (exists (select 1 from public.recipes r where r.id = recipe_id and r.status = 'published'));
create policy "published steps are readable" on public.recipe_steps for select to anon, authenticated using (exists (select 1 from public.recipes r where r.id = recipe_id and r.status = 'published'));
create policy "published step ingredients are readable" on public.recipe_step_ingredients for select to anon, authenticated using (exists (select 1 from public.recipe_steps s join public.recipes r on r.id = s.recipe_id where s.id = step_id and r.status = 'published'));
create policy "published tips are readable" on public.recipe_tips for select to anon, authenticated using (exists (select 1 from public.recipes r where r.id = recipe_id and r.status = 'published'));
create policy "published sources are readable" on public.recipe_sources for select to anon, authenticated using (exists (select 1 from public.recipes r where r.id = recipe_id and r.status = 'published'));
create policy "users read own likes" on public.recipe_likes for select to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "users insert own likes" on public.recipe_likes for insert to authenticated with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "users delete own likes" on public.recipe_likes for delete to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

grant select on public.recipes, public.recipe_ingredients, public.recipe_steps, public.recipe_step_ingredients, public.recipe_tips, public.recipe_sources to anon, authenticated;
grant select, insert, delete on public.recipe_likes to authenticated;

create or replace function public.recipe_like_counts()
returns table (recipe_id uuid, total_likes bigint, weekly_likes bigint, last_liked_at timestamptz)
language sql
stable
security invoker
set search_path = ''
as $$
  select r.id,
    count(l.user_id)::bigint,
    count(l.user_id) filter (where l.created_at >= now() - interval '7 days')::bigint,
    max(l.created_at)
  from public.recipes r
  left join public.recipe_likes l on l.recipe_id = r.id
  where r.status = 'published'
  group by r.id;
$$;

revoke all on function public.recipe_like_counts() from public;
grant execute on function public.recipe_like_counts() to service_role;
