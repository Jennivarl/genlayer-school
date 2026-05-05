-- Track certificate lifecycle updates.

alter table public.certificates
  add column if not exists updated_at timestamptz not null default now();

create index if not exists certificates_status_idx on public.certificates (learner_id, status);
