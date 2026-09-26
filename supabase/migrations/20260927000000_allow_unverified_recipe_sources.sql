-- Draft recipes can carry a useful reference before an editor has actually
-- checked it.  A missing date is intentional; never invent a verification
-- date just to satisfy the schema.
alter table public.recipe_sources
  alter column verified_at drop not null;
