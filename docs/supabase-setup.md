# Supabase Backend Setup

GenLayer School currently supports two backend storage modes:

- `local`: stores progress in `.local-data/progress.json` for development.
- `supabase`: stores learners, lesson progress, quiz attempts, and certificates in Supabase Postgres.
- `auto`: uses Supabase when `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` exist, otherwise falls back to local.

## Setup

1. Create a Supabase project.
2. Run `supabase/migrations/0001_initial_learning_schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Fill:

```text
GENLAYER_SCHOOL_STORAGE_DRIVER=supabase
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

The service role key must stay server-side only. Do not expose it to client components.

## Current Tables

- `learner_profiles`
- `lesson_progress`
- `quiz_attempts`
- `certificates`

## Next Auth Step

The next step is wallet signature verification and Supabase Auth identity linking. For now, API routes use `demo-learner` unless a `learnerId` is provided.
