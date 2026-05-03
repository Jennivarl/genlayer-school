-- GenLayer School initial backend schema.
-- Run this in Supabase SQL editor or with the Supabase CLI.

create extension if not exists pgcrypto;

create table if not exists public.learner_profiles (
  id uuid primary key default gen_random_uuid(),
  learner_id text not null unique,
  display_name text,
  wallet_address text unique,
  email text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  learner_id text not null references public.learner_profiles(learner_id) on delete cascade,
  course_slug text not null,
  lesson_slug text not null,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (learner_id, course_slug, lesson_slug)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  learner_id text not null references public.learner_profiles(learner_id) on delete cascade,
  quiz_kind text not null check (quiz_kind in ('course', 'weekly')),
  quiz_slug text not null,
  score integer not null check (score >= 0),
  total integer not null check (total >= 0),
  percent integer not null check (percent >= 0 and percent <= 100),
  passed boolean not null default false,
  answers jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  learner_id text not null references public.learner_profiles(learner_id) on delete cascade,
  certificate_slug text not null,
  status text not null default 'eligible' check (status in ('eligible', 'mint_pending', 'minted', 'revoked')),
  contract_address text,
  tx_hash text,
  issued_at timestamptz not null default now(),
  unique (learner_id, certificate_slug)
);

create index if not exists lesson_progress_learner_idx on public.lesson_progress (learner_id);
create index if not exists quiz_attempts_learner_idx on public.quiz_attempts (learner_id, submitted_at desc);
create index if not exists certificates_learner_idx on public.certificates (learner_id);

alter table public.learner_profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.certificates enable row level security;

-- Service-role API routes bypass RLS. Public policies can be tightened once auth is connected.
create policy "profiles service readable" on public.learner_profiles for select using (true);
create policy "lesson progress service readable" on public.lesson_progress for select using (true);
create policy "quiz attempts service readable" on public.quiz_attempts for select using (true);
create policy "certificates service readable" on public.certificates for select using (true);
