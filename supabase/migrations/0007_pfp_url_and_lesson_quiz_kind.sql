-- Add profile picture URL to learner profiles and allow lesson quiz attempts.

alter table public.learner_profiles
  add column if not exists pfp_url text;

alter table public.quiz_attempts
  drop constraint if exists quiz_attempts_quiz_kind_check;

alter table public.quiz_attempts
  add constraint quiz_attempts_quiz_kind_check
  check (quiz_kind in ('course', 'weekly', 'regional', 'lesson'));
