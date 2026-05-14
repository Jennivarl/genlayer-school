-- Allow regional tracks to be managed through admin content.

alter table public.admin_content_entries
  drop constraint if exists admin_content_entries_kind_check;

alter table public.admin_content_entries
  add constraint admin_content_entries_kind_check
  check (kind in ('weekly', 'spotlight', 'regional'));
