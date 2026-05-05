-- Store editable community content drafts and published entries.

create table if not exists public.admin_content_entries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('weekly', 'spotlight')),
  slug text not null,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  unique (kind, slug)
);

create index if not exists admin_content_entries_status_idx on public.admin_content_entries (kind, status, updated_at desc);

alter table public.admin_content_entries enable row level security;

create policy "admin content service readable" on public.admin_content_entries for select using (true);
