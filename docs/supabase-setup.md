# Supabase Backend Setup

GenLayer School currently supports two backend storage modes:

- `local`: stores profiles and progress in `.local-data/progress.json` for development.
- `supabase`: stores learners, usernames, lesson progress, quiz attempts, and certificates in Supabase Postgres.
- `auto`: uses Supabase when `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` exist, otherwise falls back to local.

## Setup

1. Create a Supabase project.
2. Run migrations in order:
   - `supabase/migrations/0001_initial_learning_schema.sql`
   - `supabase/migrations/0002_add_usernames.sql`
   - `supabase/migrations/0003_certificate_record_updates.sql`
   - `supabase/migrations/0004_admin_content_entries.sql`
3. Copy `.env.example` to `.env.local`.
4. Fill:

```text
GENLAYER_SCHOOL_STORAGE_DRIVER=supabase
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

The service role key must stay server-side only. Do not expose it to client components.

## Current Tables

- `learner_profiles` with `username`, `display_name`, wallet, and email fields
- `lesson_progress`
- `quiz_attempts`
- `certificates`
- `admin_content_entries`

Certificate rows track lifecycle status: `eligible`, `mint_pending`, `minted`, or `revoked`.

Admin content rows store editable JSON payloads for weekly Gen-Fren summaries and monthly community spotlights.

## Auth

Privy-authenticated learner records use `privy:<privy-user-id>` as the stable learner ID. Demo mode uses `demo-learner`.
