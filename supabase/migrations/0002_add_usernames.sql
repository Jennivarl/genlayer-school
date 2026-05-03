-- Add unique usernames to learner profiles.

alter table public.learner_profiles
  add column if not exists username text;

create unique index if not exists learner_profiles_username_unique_idx
  on public.learner_profiles (lower(username))
  where username is not null;
