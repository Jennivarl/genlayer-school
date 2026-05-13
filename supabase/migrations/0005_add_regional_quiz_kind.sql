-- Allow regional GenLayer School quiz attempts.

alter table public.quiz_attempts
  drop constraint if exists quiz_attempts_quiz_kind_check;

alter table public.quiz_attempts
  add constraint quiz_attempts_quiz_kind_check
  check (quiz_kind in ('course', 'weekly', 'regional'));
